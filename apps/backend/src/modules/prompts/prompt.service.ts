import { PromptError } from "@promptomat/shared";

import { Database } from "~/libs/modules/database/database.js";
import {
	GeneratorInterface,
	SchemaKey,
	TextGenerationError,
} from "~/libs/modules/generator/generator.js";
import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";

import { LabelService } from "../labels/labels.js";
import {
	LABEL_GENERATION_MAX_TOKENS,
	LABEL_GENERATION_TEMPERATURE,
	LABEL_GENERATION_TOPP,
} from "./libs/constants/constants.js";
import { createGenerateLabelMessage } from "./libs/helpers/helpers.js";
import {
	type PromptCreatePayload,
	type PromptDto,
} from "./libs/types/types.js";
import { PromptEntity } from "./prompt.entity.js";
import { type PromptRepository } from "./prompt.repository.js";

type Constructor = {
	database: Database;
	generator: GeneratorInterface;
	labelService: LabelService;
	promptEmbeddingService: PromptEmbeddingService;
	promptRepository: PromptRepository;
};

class PromptService {
	private database: Database;

	private generator: GeneratorInterface;

	private labelService: LabelService;

	private promptEmbeddingService: PromptEmbeddingService;

	private promptRepository: PromptRepository;

	public constructor({
		database,
		generator,
		labelService,
		promptEmbeddingService,
		promptRepository,
	}: Constructor) {
		this.promptRepository = promptRepository;
		this.labelService = labelService;
		this.generator = generator;
		this.database = database;
		this.promptEmbeddingService = promptEmbeddingService;
	}

	private async generateLabel(prompt: string, workspaceId: number) {
		try {
			const labels = await this.labelService.findAll(workspaceId);
			const result = await this.generator.generate({
				config: {
					maxTokens: LABEL_GENERATION_MAX_TOKENS,
					temperature: LABEL_GENERATION_TEMPERATURE,
					topP: LABEL_GENERATION_TOPP,
				},
				message: createGenerateLabelMessage(prompt, labels),
				schemaKey: SchemaKey.LABEL,
			});

			return result.label;
		} catch (error) {
			if (error instanceof TextGenerationError) {
				throw PromptError.failedToCreate();
			}

			throw error;
		}
	}

	public async create(payload: PromptCreatePayload): Promise<PromptDto> {
		const { efficiencyScore, promptBody, taskIntent, userId, workspaceId } =
			payload;

		const generatedLabel = await this.generateLabel(promptBody, workspaceId);

		const prompt = await this.database.transaction(async (trx) => {
			const label = await this.labelService.getOrCreate(
				{ name: generatedLabel, workspaceId },
				trx,
			);

			const prompt = await this.promptRepository.create(
				PromptEntity.initializeNew({
					efficiencyScore,
					labelId: label.id,
					promptBody,
					taskIntent,
					userId,
					workspaceId,
				}),
				trx,
			);

			return prompt.toObject();
		});

		await this.promptEmbeddingService.embedForPrompt(prompt);

		return prompt;
	}
}

export { PromptService };
