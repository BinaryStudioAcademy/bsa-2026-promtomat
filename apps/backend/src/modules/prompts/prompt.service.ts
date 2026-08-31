import {
	type PromptCreateRequestDto,
	type PromptDto,
} from "./libs/types/types.js";
import { PromptEntity } from "./prompt.entity.js";
import { type PromptRepository } from "./prompt.repository.js";

class PromptService {
	private promptRepository: PromptRepository;

	public constructor(promptRepository: PromptRepository) {
		this.promptRepository = promptRepository;
	}

	public async create(
		payload: PromptCreateRequestDto,
		userId: number,
	): Promise<PromptDto> {
		const { efficiencyScore, promptBody, taskIntent, workspaceId } = payload;

		// TODO: varify the user has write access to workspace

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
