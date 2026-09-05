import { type WorkspaceService } from "../workspaces/workspace.service.js";
import { PromptCreatePayload, type PromptDto } from "./libs/types/types.js";
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
}

export { PromptService };
