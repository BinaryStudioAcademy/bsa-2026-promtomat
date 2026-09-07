import { type WorkspaceService } from "../workspaces/workspace.service.js";
import { PromptProgress } from "./libs/enums/enums.js";
import {
	type PromptCreatePayload,
	type PromptDto,
	type PromptGetRecentResponseDto,
	type PromptProgressResponseDto,
	type PromptReadByWorkspacePayload,
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

	public async findProgress(
		payload: PromptReadByWorkspacePayload,
	): Promise<PromptProgressResponseDto> {
		const { userId, workspaceId } = payload;

		await this.workspaceService.checkUserAccess(workspaceId, userId);

		const count =
			await this.promptRepository.findCountByWorkspaceId(workspaceId);

		return {
			count,
			target: PromptProgress.TARGET_COUNT,
		};
	}

	public async findRecent(
		payload: PromptReadByWorkspacePayload,
	): Promise<PromptGetRecentResponseDto> {
		const { userId, workspaceId } = payload;

		await this.workspaceService.checkUserAccess(workspaceId, userId);

		const items = await this.promptRepository.findRecentByWorkspaceId(
			workspaceId,
			PromptProgress.RECENT_LIMIT,
		);

		return { items };
	}
}

export { PromptService };
