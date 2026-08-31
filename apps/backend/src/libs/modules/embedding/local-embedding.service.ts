import {
	type FeatureExtractionPipeline,
	pipeline,
} from "@huggingface/transformers";

import { type Logger } from "~/libs/modules/logger/logger.js";
import { type ValueOf } from "~/libs/types/types.js";

import { EmbeddingErrorMessage, EmbeddingStatus } from "./libs/enums/enums.js";
import {
	EmbeddingFailedError,
	EmbeddingNotReadyError,
} from "./libs/exceptions/exceptions.js";
import { type Embedding, type EmbeddingService } from "./libs/types/types.js";

const LAST_DIMENSION_INDEX = -1;

const MODEL_DTYPE = "int8";

const MODEL_CALL_OPTIONS = { normalize: true, pooling: "cls" } as const;

const PROBE_TEXT = "dimension probe";

type Constructor = {
	dimensions: number;
	localPath: string;
	logger: Logger;
	modelId: string;
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

	public constructor({ dimensions, localPath, logger, modelId }: Constructor) {
		this.dimensions = dimensions;
		this.localPath = localPath;
		this.logger = logger;
		this.modelId = modelId;
	}

	public get status(): ValueOf<typeof EmbeddingStatus> {
		return this.currentStatus;
	}

	private async provision(): Promise<void> {
		try {
			this.logger.info(
				`Embedding model "${this.modelId}" is provisioning into "${this.localPath}"…`,
			);

			const extractor = await pipeline("feature-extraction", this.modelId, {
				cache_dir: this.localPath,
				dtype: MODEL_DTYPE,
			});

			await this.verifyDimension(extractor);

			this.extractor = extractor;
			this.currentStatus = EmbeddingStatus.READY;

			this.logger.info(
				`Embedding model "${this.modelId}" is ready (dimension ${this.dimensions.toString()}).`,
			);
		} catch (error) {
			this.currentStatus = EmbeddingStatus.FAILED;

			this.logger.error(
				`Embedding model "${this.modelId}" failed to provision — embedding requests will be rejected until restart.`,
				{
					message: error instanceof Error ? error.message : String(error),
					stack: error instanceof Error ? error.stack : undefined,
				},
			);
		}
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
		void this.provision();
	}
}

export { LocalEmbeddingService };
