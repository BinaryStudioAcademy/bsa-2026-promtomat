import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";
import { PaginationValue } from "~/modules/prompts/libs/enums/enums.js";
import { type PromptGetAllResponseDto } from "~/modules/prompts/libs/types/types.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { type PromptHistoryGetQueryDto } from "./libs/types/types.js";
import { type PromptHistoryRepository } from "./prompt-history.repository.js";

class PromptHistoryService {
	private promptEmbeddingService: PromptEmbeddingService;

	private promptHistoryRepository: PromptHistoryRepository;

	private workspaceService: WorkspaceService;

	public constructor(
		promptHistoryRepository: PromptHistoryRepository,
		promptEmbeddingService: PromptEmbeddingService,
		workspaceService: WorkspaceService,
	) {
		this.promptHistoryRepository = promptHistoryRepository;
		this.promptEmbeddingService = promptEmbeddingService;
		this.workspaceService = workspaceService;
	}

	public async findAll(
		query: PromptHistoryGetQueryDto,
		requesterId: number,
	): Promise<PromptGetAllResponseDto> {
		const [embedding, workspace] = await Promise.all([
			query.search
				? this.promptEmbeddingService.embedQuery(query.search)
				: null,
			this.workspaceService.findById(query.workspaceId),
		]);

		const { averageScore, items, totalCount } =
			await this.promptHistoryRepository.findAll(query, requesterId, embedding);

		return {
			averageScore,
			items: items.map((item) => ({ ...item, workspaceName: workspace.name })),
			page: query.page ?? PaginationValue.DEFAULT_PAGE,
			pageSize: query.limit ?? PaginationValue.DEFAULT_LIMIT,
			totalCount,
		};
	}
}

export { PromptHistoryService };
