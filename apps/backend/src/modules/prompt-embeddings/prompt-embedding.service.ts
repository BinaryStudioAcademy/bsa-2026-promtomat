import {
	type Embedding,
	EmbeddingFailedError,
	EmbeddingNotReadyError,
	type EmbeddingService,
} from "~/libs/modules/embedding/embedding.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { PromptEmbeddingErrorMessage } from "./libs/enums/enums.js";
import { PromptEmbeddingError } from "./libs/exceptions/exceptions.js";
import {
	composeEmbeddedText,
	computeSourceHash,
} from "./libs/helpers/helpers.js";
import {
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

	private async embedText(text: string): Promise<Embedding> {
		const [embedding] = await this.embeddingService.embed([text]);

		if (!embedding) {
			throw new PromptEmbeddingError(PromptEmbeddingErrorMessage.EMPTY_RESULT);
		}

		return embedding;
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

		this.logger.error(`Prompt ${promptId.toString()} was not embedded.`, {
			message: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		});
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
				`${PromptEmbeddingErrorMessage.DIMENSION_MISMATCH} Schema: ${schemaDimension.toString()}, configured: ${this.dimensions.toString()}.`,
			);
		}
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

		const text = composeEmbeddedText(prompt);
		const embedding = await this.embedText(text);

		await this.promptEmbeddingRepository.createOrUpdate(
			PromptEmbeddingEntity.initializeNew({
				embedding,
				modelId: this.modelId,
				promptId: prompt.id,
				sourceHash: computeSourceHash(text),
			}),
		);
	}
}

export { PromptEmbeddingService };
