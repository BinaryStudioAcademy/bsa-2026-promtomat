import { ROUND_FACTOR, ZERO_VALUE } from "~/libs/constants/constants.js";
import { DateFormat } from "~/libs/enums/enums.js";
import {
	PromptDeliveryError,
	PromptError,
} from "~/libs/exceptions/exceptions.js";
import { formatDateInTimeZone } from "~/libs/helpers/helpers.js";
import { TextGenerationError } from "~/libs/modules/bedrock/bedrock.js";
import { Database } from "~/libs/modules/database/database.js";
import { Generator } from "~/libs/modules/generator/generator.js";
import { type NearestPrompt } from "~/modules/prompt-embeddings/libs/types/types.js";
import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";
import { type UserStreakService } from "~/modules/users/user-streak.service.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { LabelService } from "../labels/labels.js";
import { PaginationValue, PromptProgress } from "./libs/enums/enums.js";
import {
	buildActivityWindow,
	createGenerateLabelOptions,
	resolveTimeZone,
} from "./libs/helpers/helpers.js";
import {
	type PromptCandidateQuery,
	type PromptCreatePayload,
	type PromptDto,
	type PromptFindAllOptions,
	type PromptFindByWorkspacePayload,
	type PromptGenerateLabelPayload,
	type PromptGetAllResponseDto,
	type PromptGetRecentResponseDto,
	type PromptItemResponseDto,
	type PromptLabelSource,
	type PromptStreakResponseDto,
	type PromptUpdateBodyPayload,
	type PromptUpdateIntentPayload,
	type PromptUpdateScorePayload,
} from "./libs/types/types.js";
import { PromptEntity } from "./prompt.entity.js";
import { type PromptRepository } from "./prompt.repository.js";

type Constructor = {
	database: Database;
	generator: Generator;
	labelService: LabelService;
	promptEmbeddingService: PromptEmbeddingService;
	promptRepository: PromptRepository;
	userStreakService: UserStreakService;
	workspaceService: WorkspaceService;
};

class PromptService {
	private database: Database;

	private generator: Generator;

	private labelService: LabelService;

	private promptEmbeddingService: PromptEmbeddingService;
	private promptRepository: PromptRepository;

	private userStreakService: UserStreakService;

	private workspaceService: WorkspaceService;

	public constructor({
		database,
		generator,
		labelService,
		promptEmbeddingService,
		promptRepository,
		userStreakService,
		workspaceService,
	}: Constructor) {
		this.promptRepository = promptRepository;
		this.labelService = labelService;
		this.generator = generator;
		this.database = database;
		this.promptEmbeddingService = promptEmbeddingService;
		this.userStreakService = userStreakService;
		this.workspaceService = workspaceService;
	}

	private async applyTextRevision({
		id,
		promptBody,
		taskIntent,
		workspaceId,
	}: {
		id: number;
		promptBody: string;
		taskIntent: string;
		workspaceId: number;
	}): Promise<PromptDto> {
		const generatedLabel = await this.generateLabel({
			promptBody,
			taskIntent,
			workspaceId,
		});

		const updatedPrompt = await this.database.transaction(async (trx) => {
			const label = await this.labelService.getOrCreate(
				{
					name: generatedLabel,
					workspaceId,
				},
				trx,
			);

			const prompt = await this.promptRepository.update(
				id,
				{ labelId: label.id, promptBody, taskIntent },
				trx,
			);

			if (!prompt) {
				throw PromptError.notFound();
			}

			await this.promptEmbeddingService.deleteForPrompt(id, trx);

			return prompt;
		});

		const savedPrompt = updatedPrompt.toObject();

		void this.promptEmbeddingService.embedForPrompt(savedPrompt);

		return { ...savedPrompt, label: generatedLabel };
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

			const createdPrompt = entity.toObject();

			await this.userStreakService.recordPromptLog(userId, trx);

			return {
				efficiencyScore: createdPrompt.efficiencyScore,
				id: createdPrompt.id,
				label: label.name,
				promptBody: createdPrompt.promptBody,
				taskIntent: createdPrompt.taskIntent,
				userId: createdPrompt.userId,
				workspaceId: createdPrompt.workspaceId,
			};
		});

		void this.promptEmbeddingService.embedForPrompt(prompt);

		return prompt;
	}

	public async findAll(
		options: PromptFindAllOptions,
	): Promise<PromptGetAllResponseDto> {
		const { query, userId } = options;
		const {
			limit = PaginationValue.DEFAULT_LIMIT,
			page = PaginationValue.DEFAULT_PAGE,
			score,
			search,
			workspaceId,
		} = query;
		const offset = (page - PaginationValue.DEFAULT_PAGE) * limit;

		const { averageScore, items, totalCount } = search
			? await this.promptEmbeddingService.findAllByQuery({
					limit,
					offset,
					score,
					search,
					userId,
					workspaceId,
				})
			: await this.promptRepository.findAll(options);

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
			pageSize: limit,
			totalCount,
		};
	}

	public async findById(
		id: number,
		userId: number,
	): Promise<PromptItemResponseDto> {
		const prompt = await this.promptRepository.findById(id);

		if (!prompt) {
			throw PromptDeliveryError.notFound();
		}

		const ownedWorkspace = await this.workspaceService.findByIdAndOwner(
			prompt.workspaceId,
			userId,
		);
		const contributedWorkspace = ownedWorkspace
			? null
			: await this.workspaceService.findByIdAndContributor(
					prompt.workspaceId,
					userId,
				);

		if (!ownedWorkspace && !contributedWorkspace) {
			throw PromptDeliveryError.notFound();
		}

		return prompt;
	}

	public async findByIdAndOwner(
		id: number,
		userId: number,
	): Promise<null | Omit<PromptDto, "label">> {
		const prompt = await this.promptRepository.findByIdAndUserId(id, userId);

		return prompt ? prompt.toObject() : null;
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

	public async findStreak(
		userId: number,
		timeZone: string,
	): Promise<PromptStreakResponseDto> {
		const resolvedTimeZone = resolveTimeZone(timeZone);
		const storedStreak = await this.userStreakService.findByUserId(userId);

		let currentStreak = storedStreak?.currentStreak ?? ZERO_VALUE;

		currentStreak =
			storedStreak?.timeZone === resolvedTimeZone
				? currentStreak
				: await this.userStreakService.recomputeForTimeZone(
						userId,
						resolvedTimeZone,
					);

		const activeDays = await this.promptRepository.findActiveDaysByUserId(
			userId,
			resolvedTimeZone,
		);

		const today = formatDateInTimeZone(
			new Date(),
			resolvedTimeZone,
			DateFormat.ISO_DATE,
		);

		return {
			currentStreak,
			days: buildActivityWindow(activeDays, today),
		};
	}

	public async findUserPromptSummary(userId: number): Promise<{
		averageScore: null | number;
		totalCount: number;
	}> {
		const { averageScore, totalCount } =
			await this.promptRepository.findUserPromptSummary(userId);

		return {
			averageScore:
				averageScore === null
					? null
					: Math.round(averageScore * ROUND_FACTOR) / ROUND_FACTOR,
			totalCount,
		};
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

	public async updateBody(
		payload: PromptUpdateBodyPayload,
	): Promise<PromptDto> {
		const existingPrompt = await this.promptRepository.findById(payload.id);

		if (!existingPrompt) {
			throw PromptError.notFound();
		}

		return await this.applyTextRevision({
			id: payload.id,
			promptBody: payload.promptBody,
			taskIntent: existingPrompt.intent,
			workspaceId: existingPrompt.workspaceId,
		});
	}

	public async updateIntent(
		payload: PromptUpdateIntentPayload,
	): Promise<PromptDto> {
		const existingPrompt = await this.promptRepository.findById(payload.id);

		if (!existingPrompt) {
			throw PromptError.notFound();
		}

		return await this.applyTextRevision({
			id: payload.id,
			promptBody: existingPrompt.body,
			taskIntent: payload.taskIntent,
			workspaceId: existingPrompt.workspaceId,
		});
	}

	public async updateLabel(promptId: number, labelId: number): Promise<void> {
		await this.promptRepository.updateLabel(promptId, labelId);
	}

	public async updateScore(
		payload: PromptUpdateScorePayload,
	): Promise<PromptDto> {
		const existingPrompt = await this.promptRepository.findById(payload.id);

		if (!existingPrompt) {
			throw PromptError.notFound();
		}

		const updatedPrompt = await this.promptRepository.update(payload.id, {
			efficiencyScore: payload.efficiencyScore,
		});

		if (!updatedPrompt) {
			throw PromptError.notFound();
		}

		const savedPrompt = updatedPrompt.toObject();
		const label = await this.promptRepository.findLabelNameByPromptId(
			savedPrompt.id,
		);

		return {
			efficiencyScore: savedPrompt.efficiencyScore,
			id: savedPrompt.id,
			label: label ?? "",
			promptBody: savedPrompt.promptBody,
			taskIntent: savedPrompt.taskIntent,
			userId: savedPrompt.userId,
			workspaceId: savedPrompt.workspaceId,
		};
	}
}

export { PromptService };
