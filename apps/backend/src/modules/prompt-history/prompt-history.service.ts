import { PaginationValue } from "~/modules/prompts/libs/enums/enums.js";
import { type PromptGetAllResponseDto } from "~/modules/prompts/libs/types/types.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { type PromptHistoryGetQueryDto } from "./libs/types/types.js";
import { type PromptHistoryRepository } from "./prompt-history.repository.js";

class PromptHistoryService {
	private promptHistoryRepository: PromptHistoryRepository;

	private workspaceService: WorkspaceService;

	public constructor(
		promptHistoryRepository: PromptHistoryRepository,
		workspaceService: WorkspaceService,
	) {
		this.promptHistoryRepository = promptHistoryRepository;
		this.workspaceService = workspaceService;
	}

	public async findAll(
		query: PromptHistoryGetQueryDto,
	): Promise<PromptGetAllResponseDto> {
		const [{ averageScore, items, totalCount }, workspace] = await Promise.all([
			this.promptHistoryRepository.findAll(query),
			this.workspaceService.findById(query.workspaceId),
		]);

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
