import { PromptDeliveryError } from "~/libs/exceptions/exceptions.js";
import { type NearestPrompt } from "~/modules/prompt-embeddings/libs/types/types.js";
import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { PromptProgress } from "./libs/enums/enums.js";
import {
	type PromptCandidateQuery,
	type PromptCreatePayload,
	type PromptDto,
	type PromptGetRecentResponseDto,
	type PromptProgressResponseDto,
} from "./libs/types/types.js";
import { PromptEntity } from "./prompt.entity.js";
import { type PromptRepository } from "./prompt.repository.js";

class PromptService {
	private promptEmbeddingService: PromptEmbeddingService;

	private promptRepository: PromptRepository;

	private workspaceService: WorkspaceService;

	public constructor(
		promptRepository: PromptRepository,
		promptEmbeddingService: PromptEmbeddingService,
		workspaceService: WorkspaceService,
	) {
		this.promptRepository = promptRepository;
		this.promptEmbeddingService = promptEmbeddingService;
		this.workspaceService = workspaceService;
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

	public async findById(id: number, userId: number): Promise<PromptDto> {
		const prompt = await this.promptRepository.findById(id);

		if (!prompt) {
			throw PromptDeliveryError.notFound();
		}

		const { workspaceId } = prompt.toObject();

		const workspace = await this.workspaceService.findByIdAndOwner(
			workspaceId,
			userId,
		);

		if (!workspace) {
			throw PromptDeliveryError.forbidden();
		}

		return prompt.toObject();
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
}

export { PromptService };
