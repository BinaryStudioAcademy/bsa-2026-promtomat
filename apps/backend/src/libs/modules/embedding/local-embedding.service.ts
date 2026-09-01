import {
	type FeatureExtractionPipeline,
	pipeline,
} from "@huggingface/transformers";
import { access, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

import { type Logger } from "~/libs/modules/logger/logger.js";
import { type ValueOf } from "~/libs/types/types.js";

import { PROVISION_MARKER_FILE_NAME } from "./libs/constants/constants.js";
import { EmbeddingErrorMessage, EmbeddingStatus } from "./libs/enums/enums.js";
import {
	EmbeddingFailedError,
	EmbeddingNotReadyError,
} from "./libs/exceptions/exceptions.js";
import {
	type Embedding,
	type EmbeddingService,
	type ModelManifest,
} from "./libs/types/types.js";
import { type S3ModelStore } from "./s3-model-store.service.js";

const LAST_DIMENSION_INDEX = -1;

const MODEL_DTYPE = "int8";

const MODEL_CALL_OPTIONS = { normalize: true, pooling: "cls" } as const;

const PROBE_TEXT = "dimension probe";

const FIRST_RETRY_DELAY_MS = 5000;

const SECOND_RETRY_DELAY_MS = 15_000;

const PROVISION_RETRY_DELAYS_MS = [
	FIRST_RETRY_DELAY_MS,
	SECOND_RETRY_DELAY_MS,
] as const;

type Constructor = {
	dimensions: number;
	localPath: string;
	logger: Logger;
	modelId: string;
	store: S3ModelStore;
};

class LocalEmbeddingService implements EmbeddingService {
	private currentStatus: ValueOf<typeof EmbeddingStatus> =
		EmbeddingStatus.LOADING;

	private dimensions: number;

	private extractor: FeatureExtractionPipeline | null = null;

	private hasStarted = false;

	private localPath: string;

	private logger: Logger;

	private modelId: string;

	private store: S3ModelStore;

	public constructor({
		dimensions,
		localPath,
		logger,
		modelId,
		store,
	}: Constructor) {
		this.dimensions = dimensions;
		this.localPath = localPath;
		this.logger = logger;
		this.modelId = modelId;
		this.store = store;
	}

	private get markerPath(): string {
		return path.join(this.localPath, PROVISION_MARKER_FILE_NAME);
	}

	public get status(): ValueOf<typeof EmbeddingStatus> {
		return this.currentStatus;
	}

	private async collectManifest(): Promise<ModelManifest> {
		const entries = await readdir(this.localPath, {
			recursive: true,
			withFileTypes: true,
		});

		const files = entries
			.filter(
				(entry) => entry.isFile() && entry.name !== PROVISION_MARKER_FILE_NAME,
			)
			.map((entry) =>
				path
					.relative(this.localPath, path.join(entry.parentPath, entry.name))
					.split(path.sep)
					.join("/"),
			)
			.toSorted((first, second) => first.localeCompare(second));

		return { files };
	}

	private async createExtractor(
		isLocalOnly: boolean,
	): Promise<FeatureExtractionPipeline> {
		const extractor = await pipeline("feature-extraction", this.modelId, {
			cache_dir: this.localPath,
			dtype: MODEL_DTYPE,
			local_files_only: isLocalOnly,
		});

		await this.verifyDimension(extractor);

		return extractor;
	}

	private async hasLocalMarker(): Promise<boolean> {
		try {
			await access(this.markerPath);

			return true;
		} catch {
			return false;
		}
	}

	private async provision(): Promise<void> {
		if (await this.hasLocalMarker()) {
			this.logger.info(
				`Embedding model "${this.modelId}" has a local marker — loading from disk with zero S3 calls.`,
			);
			this.extractor = await this.createExtractor(true);

			return;
		}

		await this.resetLocalPath();

		if (await this.store.hasMarker()) {
			this.logger.info(
				"Embedding model store marker found — downloading the model from S3.",
			);

			const manifest = await this.store.downloadModel(this.localPath);
			await this.writeLocalMarker(manifest);
			this.extractor = await this.createExtractor(true);

			return;
		}

		this.logger.info(
			`Embedding model store marker absent — seeding "${this.modelId}" from HuggingFace.`,
		);

		const extractor = await this.createExtractor(false);
		const manifest = await this.collectManifest();
		await this.store.uploadModel(this.localPath, manifest);
		await this.writeLocalMarker(manifest);
		this.extractor = extractor;
	}

	private async provisionWithRetries(): Promise<void> {
		const remainingDelays = [...PROVISION_RETRY_DELAYS_MS];

		while (this.currentStatus === EmbeddingStatus.LOADING) {
			try {
				this.logger.info(
					`Embedding model "${this.modelId}" is provisioning into "${this.localPath}"…`,
				);

				await this.provision();
				this.currentStatus = EmbeddingStatus.READY;

				this.logger.info(
					`Embedding model "${this.modelId}" is ready (dimension ${this.dimensions.toString()}).`,
				);

				return;
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				const retryDelay = remainingDelays.shift();

				if (retryDelay === undefined) {
					this.currentStatus = EmbeddingStatus.FAILED;

					this.logger.error(
						`Embedding model "${this.modelId}" failed to provision — retries exhausted, embedding requests will be rejected until restart.`,
						{
							message,
							stack: error instanceof Error ? error.stack : undefined,
						},
					);

					return;
				}

				this.logger.warn(
					`Embedding provisioning attempt failed: ${message}. Retrying in ${retryDelay.toString()}ms (${remainingDelays.length.toString()} retries left after this one).`,
				);

				await delay(retryDelay);
			}
		}
	}

	private async resetLocalPath(): Promise<void> {
		const resolvedPath = path.resolve(this.localPath);
		const isProtectedPath =
			resolvedPath === path.parse(resolvedPath).root ||
			resolvedPath === os.homedir();

		if (isProtectedPath) {
			throw new Error(
				`Refusing to reset "${resolvedPath}" — the embedding local path must be a dedicated directory.`,
			);
		}

		this.logger.warn(
			`Embedding model at "${this.localPath}" has no completion marker — removing any incomplete files before re-provisioning.`,
		);

		await rm(resolvedPath, { force: true, recursive: true });
		await mkdir(resolvedPath, { recursive: true });
	}

	private async verifyDimension(
		extractor: FeatureExtractionPipeline,
	): Promise<void> {
		const output = await extractor([PROBE_TEXT], MODEL_CALL_OPTIONS);
		const dimension = output.dims.at(LAST_DIMENSION_INDEX);

		if (dimension !== this.dimensions) {
			throw new Error(
				`Model output dimension ${String(dimension)} does not match the configured ${this.dimensions.toString()}.`,
			);
		}
	}

	private async writeLocalMarker(manifest: ModelManifest): Promise<void> {
		await writeFile(this.markerPath, JSON.stringify(manifest));

		this.logger.info(
			`Embedding model marker written to "${this.markerPath}" — transfer complete.`,
		);
	}

	public async embed(texts: string[]): Promise<Embedding[]> {
		if (this.currentStatus === EmbeddingStatus.FAILED) {
			throw new EmbeddingFailedError(EmbeddingErrorMessage.MODEL_FAILED);
		}

		if (!this.extractor) {
			throw new EmbeddingNotReadyError(EmbeddingErrorMessage.MODEL_NOT_READY);
		}

		const output = await this.extractor(texts, MODEL_CALL_OPTIONS);

		return output.tolist() as Embedding[];
	}

	public init(): void {
		if (this.hasStarted) {
			return;
		}

		this.hasStarted = true;
		void this.provisionWithRetries();
	}
}

export { LocalEmbeddingService };
