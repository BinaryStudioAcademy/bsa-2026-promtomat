import { type WorkspaceService } from "../workspaces/workspace.service.js";
import {
	type PromptCreatePayload,
	type PromptDto,
	type PromptGetAllResponseDto,
	type PromptGetQueryDto,
} from "./libs/types/types.js";
import { PromptEntity } from "./prompt.entity.js";
import { type PromptRepository } from "./prompt.repository.js";

class PromptService {
	private promptRepository: PromptRepository;

	private workspaceService: WorkspaceService;

	public constructor(
		promptRepository: PromptRepository,
		workspaceService: WorkspaceService,
	) {
		this.promptRepository = promptRepository;
		this.workspaceService = workspaceService;
	}

	public async create(payload: PromptCreatePayload): Promise<PromptDto> {
		const { efficiencyScore, promptBody, taskIntent, userId, workspaceId } =
			payload;

		await this.workspaceService.checkUserAccess(workspaceId, userId);

		const prompt = await this.promptRepository.create(
			PromptEntity.initializeNew({
				efficiencyScore,
				promptBody,
				taskIntent,
				userId,
				workspaceId,
			}),
		);

		return prompt.toObject();
	}

	public async findAll(options: {
		query: PromptGetQueryDto;
		userId: number;
	}): Promise<PromptGetAllResponseDto> {
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
