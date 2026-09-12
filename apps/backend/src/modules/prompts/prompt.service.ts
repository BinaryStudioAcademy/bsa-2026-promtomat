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
	normalizePromptLabel,
} from "../labels/labels.js";
import {
	LABEL_GENERATION_MAX_TOKENS,
	LABEL_GENERATION_TEMPERATURE,
	LABEL_GENERATION_TOP_P,
} from "./libs/constants/constants.js";
import { PromptProgress } from "./libs/enums/enums.js";
import { createGenerateLabelMessage } from "./libs/helpers/helpers.js";
import {
	type PromptCreatePayload,
	type PromptDto,
	type PromptFindByWorkspacePayload,
	type PromptGenerateLabelPayload,
	type PromptGetRecentResponseDto,
	type PromptLabelSource,
	type PromptProgressResponseDto,
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

	private async generateAndNormalizeLabel(prompt: PromptGenerateLabelPayload) {
		const label = await this.generateLabel(prompt);
		const normalized = normalizePromptLabel(label);

		if (normalized === null) {
			throw PromptError.failedToCreate();
		}

		return normalized;
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
					topP: LABEL_GENERATION_TOP_P,
				},
				message: createGenerateLabelMessage({
					existingLabels: labels,
					promptBody: prompt.promptBody,
					taskIntent: prompt.taskIntent,
				}),
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

		const generatedLabel = await this.generateAndNormalizeLabel({
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

	public async findByWorkspace(
		payload: PromptFindByWorkspacePayload,
	): Promise<PromptDto[]> {
		return await this.promptRepository.findByWorkspace(payload);
	}

	public async findProgress(
		workspaceId: number,
	): Promise<PromptProgressResponseDto> {
		const count =
			await this.promptRepository.findCountByWorkspaceId(workspaceId);

		return {
			count,
			target: PromptProgress.TARGET_COUNT,
		};
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

	public async findRecent(
		workspaceId: number,
	): Promise<PromptGetRecentResponseDto> {
		const items = await this.promptRepository.findRecentByWorkspaceId(
			workspaceId,
			PromptProgress.RECENT_LIMIT,
		);

		return { items };
	}

	public async regenerateLabel(prompt: PromptLabelSource): Promise<void> {
		const generatedLabel = await this.generateAndNormalizeLabel({
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
