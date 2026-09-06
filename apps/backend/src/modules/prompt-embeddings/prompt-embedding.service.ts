import { getErrorDetails } from "~/libs/helpers/helpers.js";
import {
	type Embedding,
	EmbeddingFailedError,
	EmbeddingNotReadyError,
	type EmbeddingService,
} from "~/libs/modules/embedding/embedding.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import {
	BACKFILL_BATCH_SIZE,
	BACKFILL_PAGE_SIZE,
} from "./libs/constants/constants.js";
import { PromptEmbeddingErrorMessage } from "./libs/enums/enums.js";
import { PromptEmbeddingError } from "./libs/exceptions/exceptions.js";
import {
	composeEmbeddedText,
	computeSourceHash,
	splitIntoBatches,
} from "./libs/helpers/helpers.js";
import {
	type BackfillReport,
	type IndexedPromptSource,
	type NearestPrompt,
	type PromptEmbeddingSource,
} from "./libs/types/types.js";
import { PromptEmbeddingEntity } from "./prompt-embedding.entity.js";
import { type PromptEmbeddingRepository } from "./prompt-embedding.repository.js";

type Constructor = {
	dimensions: number;
	embeddingService: EmbeddingService;
	logger: Logger;
	modelId: string;
	promptEmbeddingRepository: PromptEmbeddingRepository;
};

class PromptEmbeddingService {
	private dimensions: number;

	private embeddingService: EmbeddingService;

	private logger: Logger;

	private modelId: string;

	private promptEmbeddingRepository: PromptEmbeddingRepository;

	private schemaVerification: null | Promise<void> = null;

	public constructor({
		dimensions,
		embeddingService,
		logger,
		modelId,
		promptEmbeddingRepository,
	}: Constructor) {
		this.dimensions = dimensions;
		this.embeddingService = embeddingService;
		this.logger = logger;
		this.modelId = modelId;
		this.promptEmbeddingRepository = promptEmbeddingRepository;
	}

	// Embeds one batch and stores each row on its own, so a failed row costs only itself.
	private async backfillBatch(
		sources: PromptEmbeddingSource[],
	): Promise<Pick<BackfillReport, "embedded" | "failed">> {
		const report = { embedded: 0, failed: 0 };
		let entities: PromptEmbeddingEntity[];

		try {
			entities = await this.embedSources(sources);
		} catch (error) {
			this.logBackfillFailure(
				sources.map((source) => source.id),
				error,
			);

			return { ...report, failed: sources.length };
		}

		const results = await Promise.allSettled(
			entities.map((entity) =>
				this.promptEmbeddingRepository.createOrUpdate(entity),
			),
		);

		for (const [index, entity] of entities.entries()) {
			const result = results[index];

			if (result?.status === "fulfilled") {
				report.embedded++;
			} else {
				this.logBackfillFailure([entity.toObject().promptId], result?.reason);
				report.failed++;
			}
		}

		return report;
	}

	private checkIsCurrent({
		modelId,
		sourceHash,
		...source
	}: IndexedPromptSource): boolean {
		return (
			modelId === this.modelId &&
			sourceHash === computeSourceHash(composeEmbeddedText(source))
		);
	}

	private async embedSources(
		sources: PromptEmbeddingSource[],
	): Promise<PromptEmbeddingEntity[]> {
		const embeddedTexts = sources.map((source) => ({
			source,
			text: composeEmbeddedText(source),
		}));
		const embeddings = await this.embeddingService.embed(
			embeddedTexts.map(({ text }) => text),
		);

		if (embeddings.length !== embeddedTexts.length) {
			throw new PromptEmbeddingError(
				PromptEmbeddingErrorMessage.RESULT_COUNT_MISMATCH,
			);
		}

		return embeddedTexts.map(({ source, text }, index) => {
			const embedding = embeddings[index];

			if (!embedding) {
				throw new PromptEmbeddingError(
					PromptEmbeddingErrorMessage.EMPTY_RESULT,
				);
			}

			return PromptEmbeddingEntity.initializeNew({
				embedding,
				modelId: this.modelId,
				promptId: source.id,
				sourceHash: computeSourceHash(text),
			});
		});
	}

	private logBackfillFailure(promptIds: number[], error: unknown): void {
		this.logger.error(
			`Backfill did not embed prompts ${promptIds.join(", ")} — they stay eligible for the next run.`,
			getErrorDetails(error),
		);
	}

	private logFailure(promptId: number, error: unknown): void {
		if (error instanceof EmbeddingNotReadyError) {
			this.logger.warn(
				`Prompt ${promptId.toString()} was not embedded — the embedding model is not ready yet; the backfill will close the gap.`,
			);

			return;
		}

		if (error instanceof EmbeddingFailedError) {
			this.logger.error(
				`Prompt ${promptId.toString()} was not embedded — the embedding model failed to provision; restart the backend, then run the backfill.`,
			);

			return;
		}

		this.logger.error(
			`Prompt ${promptId.toString()} was not embedded.`,
			getErrorDetails(error),
		);
	}

	private async verifySchemaDimension(): Promise<void> {
		this.schemaVerification ??= this.verifySchemaDimensionOnce();

		try {
			await this.schemaVerification;
		} catch (error) {
			this.schemaVerification = null;
			throw error;
		}
	}

	private async verifySchemaDimensionOnce(): Promise<void> {
		const schemaDimension =
			await this.promptEmbeddingRepository.findSchemaDimension();

		if (schemaDimension === null) {
			throw new PromptEmbeddingError(
				PromptEmbeddingErrorMessage.SCHEMA_COLUMN_MISSING,
			);
		}

		if (schemaDimension !== this.dimensions) {
			throw new PromptEmbeddingError(
				`The prompt embeddings column is vector(${schemaDimension.toString()}) while EMBEDDING_DIMENSIONS is ${this.dimensions.toString()}.`,
			);
		}
	}

	public async backfill(): Promise<BackfillReport> {
		await this.verifySchemaDimension();

		const report: BackfillReport = { embedded: 0, failed: 0, skipped: 0 };
		let afterId = 0;
		let page: IndexedPromptSource[];

		do {
			page = await this.promptEmbeddingRepository.findIndexedSourcesAfter(
				afterId,
				BACKFILL_PAGE_SIZE,
			);

			const staleSources: PromptEmbeddingSource[] = [];

			for (const source of page) {
				afterId = source.id;

				if (this.checkIsCurrent(source)) {
					report.skipped++;
				} else {
					staleSources.push(source);
				}
			}

			for (const batch of splitIntoBatches(staleSources, BACKFILL_BATCH_SIZE)) {
				const { embedded, failed } = await this.backfillBatch(batch);

				report.embedded += embedded;
				report.failed += failed;
			}
		} while (page.length === BACKFILL_PAGE_SIZE);

		return report;
	}

	// Fire-and-forget: never throws into the caller, every failure is logged.
	public async embedForPrompt(prompt: PromptEmbeddingSource): Promise<void> {
		try {
			await this.regenerateForPrompt(prompt);
		} catch (error) {
			this.logFailure(prompt.id, error);
		}
	}

	public findNearest(
		embedding: Embedding,
		limit: number,
	): Promise<NearestPrompt[]> {
		return this.promptEmbeddingRepository.findNearest(embedding, limit);
	}

	public async regenerateForPrompt(
		prompt: PromptEmbeddingSource,
	): Promise<void> {
		await this.verifySchemaDimension();

		const entities = await this.embedSources([prompt]);

		for (const entity of entities) {
			await this.promptEmbeddingRepository.createOrUpdate(entity);
		}
	}
}

export { PromptEmbeddingService };
