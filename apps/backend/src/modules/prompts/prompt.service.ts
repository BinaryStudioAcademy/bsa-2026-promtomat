import { PromptError } from "~/libs/exceptions/exceptions.js";
import { Database } from "~/libs/modules/database/database.js";
import {
	GeneratorInterface,
	SchemaKey,
	TextGenerationError,
} from "~/libs/modules/generator/generator.js";
import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";

import {
	LABEL_REUSE_SET_LIMIT,
	LabelService,
	normalizeLabel,
} from "../labels/labels.js";
import {
	LABEL_GENERATION_MAX_TOKENS,
	LABEL_GENERATION_TEMPERATURE,
	LABEL_GENERATION_TOPP,
} from "./libs/constants/constants.js";
import { createGenerateLabelMessage } from "./libs/helpers/helpers.js";
import {
	type PromptCreatePayload,
	type PromptDto,
	type PromptGenerateLabelPayload,
	PromptLabelSource,
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

	private async generateLabel(
		prompt: PromptGenerateLabelPayload,
	): Promise<string> {
		try {
			const labels = await this.labelService.findMostUsedNames(
				prompt.workspaceId,
				LABEL_REUSE_SET_LIMIT,
			);
			const result = await this.generator.generate({
				config: {
					maxTokens: LABEL_GENERATION_MAX_TOKENS,
					temperature: LABEL_GENERATION_TEMPERATURE,
					topP: LABEL_GENERATION_TOPP,
				},
				message: createGenerateLabelMessage({
					existingLabels: labels,
					promptBody: prompt.promptBody,
					taskIntent: prompt.taskIntent,
				}),
				schemaKey: SchemaKey.LABEL,
			});

			const normalized = normalizeLabel(result.label);

			if (normalized === null) {
				throw PromptError.failedToCreate();
			}

			return normalized;
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

		const generatedLabel = await this.generateLabel({
			promptBody,
			taskIntent,
			workspaceId,
		});

		const prompt = await this.database.transaction(async (trx) => {
			const label = await this.labelService.getOrCreate(
				{ name: generatedLabel, workspaceId },
				trx,
			);

			const created = await this.promptRepository.create(
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

			const object = created.toObject();

			return {
				efficiencyScore: object.efficiencyScore,
				id: object.id,
				label: label.name,
				promptBody: object.promptBody,
				taskIntent: object.taskIntent,
				userId: object.userId,
				workspaceId: object.workspaceId,
			};
		});

		await this.promptEmbeddingService.embedForPrompt(prompt);

		return prompt;
	}

	public async findAllByWorkspace(
		workspaceId: number,
		labelId?: number,
	): Promise<PromptDto[]> {
		return await this.promptRepository.findAllByWorkspace(workspaceId, labelId);
	}

	public async findPromptsWithoutLabels(
		limit: number,
		afterId: number,
	): Promise<PromptLabelSource[]> {
		const result = await this.promptRepository.findPromptsWithoutLabels(
			limit,
			afterId,
		);
		return result.map((prompt) => prompt.toObject());
	}

	public async regenerateLabel(prompt: PromptLabelSource): Promise<void> {
		const generatedLabel = await this.generateLabel({
			promptBody: prompt.promptBody,
			taskIntent: prompt.taskIntent,
			workspaceId: prompt.workspaceId,
		});

		const label = await this.labelService.getOrCreate({
			name: generatedLabel,
			workspaceId: prompt.workspaceId,
		});

		await this.promptRepository.updateLabel(prompt.id, label.id);
	}

	public async updateLabel(promptId: number, labelId: number): Promise<void> {
		await this.promptRepository.updateLabel(promptId, labelId);
	}
}

export { PromptService };
