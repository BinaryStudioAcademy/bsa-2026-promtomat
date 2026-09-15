import { PromptError } from "~/libs/exceptions/exceptions.js";
import { type Database } from "~/libs/modules/database/database.js";
import { type NearestPrompt } from "~/modules/prompt-embeddings/libs/types/types.js";
import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";

import { ROUND_FACTOR } from "./libs/constants/constants.js";
import { PromptProgress } from "./libs/enums/enums.js";
import {
	type PromptCandidateQuery,
	type PromptCreatePayload,
	type PromptDto,
	type PromptFindAllOptions,
	type PromptGetAllResponseDto,
	type PromptGetRecentResponseDto,
	type PromptProgressResponseDto,
	type PromptUpdateIntentPayload,
} from "./libs/types/types.js";
import { PromptEntity } from "./prompt.entity.js";
import { type PromptRepository } from "./prompt.repository.js";

class PromptService {
	private database: Database;

	private promptEmbeddingService: PromptEmbeddingService;

	private promptRepository: PromptRepository;

	public constructor(
		database: Database,
		promptRepository: PromptRepository,
		promptEmbeddingService: PromptEmbeddingService,
	) {
		this.database = database;
		this.promptRepository = promptRepository;
		this.promptEmbeddingService = promptEmbeddingService;
	}

	public async create(payload: PromptCreatePayload): Promise<PromptDto> {
		const { efficiencyScore, promptBody, taskIntent, userId, workspaceId } =
			payload;

		const prompt = await this.promptRepository.create(
			PromptEntity.initializeNew({
				efficiencyScore,
				promptBody,
				taskIntent,
				userId,
				workspaceId,
			}),
		);

		const promptDto = prompt.toObject();

		void this.promptEmbeddingService.embedForPrompt(promptDto);

		return promptDto;
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
				PromptEntity.initialize(item).toDto(item.workspace.name),
			),
			page,
			pageSize,
			totalCount,
		};
	}

	public async findByIdAndOwner(
		id: number,
		userId: number,
	): Promise<null | PromptDto> {
		const prompt = await this.promptRepository.findByIdAndUserId(id, userId);

		return prompt ? prompt.toObject() : null;
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

	public async findRecent(
		workspaceId: number,
	): Promise<PromptGetRecentResponseDto> {
		const items = await this.promptRepository.findRecentByWorkspaceId(
			workspaceId,
			PromptProgress.RECENT_LIMIT,
		);

		return { items };
	}

	public async updateIntent(
		payload: PromptUpdateIntentPayload,
	): Promise<PromptDto> {
		const { id, taskIntent } = payload;

		const updatedPrompt = await this.database.transaction(async (trx) => {
			const prompt = await this.promptRepository.update(
				id,
				{ taskIntent },
				trx,
			);

			if (!prompt) {
				throw PromptError.notFound();
			}

			await this.promptEmbeddingService.deleteForPrompt(id, trx);

			// Regenerate AI label

			return prompt;
		});

		const promptDto = updatedPrompt.toObject();

		void this.promptEmbeddingService.embedForPrompt(promptDto);

		return promptDto;
	}
}

export { PromptService };
