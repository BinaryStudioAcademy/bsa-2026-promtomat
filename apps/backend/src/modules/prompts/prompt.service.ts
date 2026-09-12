import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";

import { PromptProgress } from "./libs/enums/enums.js";
import {
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

	public constructor(
		promptRepository: PromptRepository,
		promptEmbeddingService: PromptEmbeddingService,
	) {
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
