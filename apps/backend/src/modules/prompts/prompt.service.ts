import { PromptError } from "~/libs/exceptions/exceptions.js";
import { Database } from "~/libs/modules/database/database.js";
import {
	GeneratorInterface,
	TextGenerationError,
} from "~/libs/modules/generator/generator.js";
import { type NearestPrompt } from "~/modules/prompt-embeddings/libs/types/types.js";
import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";

import { LabelService } from "../labels/labels.js";
import { ROUND_FACTOR } from "./libs/constants/constants.js";
import { PromptProgress } from "./libs/enums/enums.js";
import { createGenerateLabelOptions } from "./libs/helpers/helpers.js";
import {
	type PromptCandidateQuery,
	type PromptCreatePayload,
	type PromptDto,
	type PromptFindAllOptions,
	type PromptFindByWorkspacePayload,
	type PromptGenerateLabelPayload,
	type PromptGetAllResponseDto,
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

	private async generateLabel({
		promptBody,
		taskIntent,
		workspaceId,
	}: PromptGenerateLabelPayload): Promise<string> {
		try {
			const nearestLabels =
				await this.promptEmbeddingService.findNearestLabelNames({
					promptBody,
					taskIntent,
					workspaceId,
				});

			const result = await this.generator.generate(
				createGenerateLabelOptions(nearestLabels, promptBody, taskIntent),
			);

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

			const entity = await this.promptRepository.create(
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

			const object = entity.toObject();

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

		void this.promptEmbeddingService.embedForPrompt(prompt);

		return prompt;
	}

	public async findAll(
		options: PromptFindAllOptions,
	): Promise<PromptGetAllResponseDto> {
		const { averageScore, items, page, pageSize, totalCount } =
			await this.promptRepository.findAll(options);

		const formattedAverageScore =
			averageScore === null
				? null
				: Math.round(averageScore * ROUND_FACTOR) / ROUND_FACTOR;

		return {
			averageScore: formattedAverageScore,
			items: items.map((item) =>
				PromptEntity.initialize(item).toDto(item.workspaceName),
			),
			page,
			pageSize,
			totalCount,
		};
	}

	public async findByWorkspace(
		payload: PromptFindByWorkspacePayload,
	): Promise<PromptDto[]> {
		return await this.promptRepository.findByWorkspace(payload);
	}

	public findCandidates({
		description,
		limit,
		workspaceId,
	}: PromptCandidateQuery): Promise<NearestPrompt[]> {
		return this.promptEmbeddingService.findNearestByQuery(
			description,
			limit,
			workspaceId,
		);
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

	public async findUserPromptSummary(userId: number): Promise<{
		averageScore: null | number;
		totalCount: number;
	}> {
		return await this.promptRepository.findUserPromptSummary(userId);
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
