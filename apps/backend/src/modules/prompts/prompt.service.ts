import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";

import {
	type PromptCreatePayload,
	type PromptDto,
	PromptFindAllOptions,
	type PromptGetAllResponseDto,
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

	public async findAll(
		options: PromptFindAllOptions,
	): Promise<PromptGetAllResponseDto> {
		const { averageScore, items, page, pageSize, totalCount } =
			await this.promptRepository.findAll(options);

		return {
			averageScore,
			items: items.map((item) => ({
				body: item.promptBody,
				createdAt: item.createdAt,
				id: item.id,
				intent: item.taskIntent,
				score: item.efficiencyScore,
				workspaceId: item.workspaceId,
				workspaceName: item.workspace?.name ?? "",
			})),
			page,
			pageSize,
			totalCount,
		};
	}
}

export { PromptService };
