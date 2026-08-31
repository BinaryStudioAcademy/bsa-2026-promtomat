import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";

class PromptRepository {
	private promptModel: typeof PromptModel;

	public constructor(promptModel: typeof PromptModel) {
		this.promptModel = promptModel;
	}

	public async create(entity: PromptEntity): Promise<PromptEntity> {
		const { efficiencyScore, promptBody, taskIntent, userId, workspaceId } =
			entity.toNewObject();

		const prompt = await this.promptModel
			.query()
			.insert({
				efficiencyScore,
				promptBody,
				taskIntent,
				userId,
				workspaceId,
			})
			.returning("*")
			.execute();

		return PromptEntity.initialize(prompt);
	}
}

export { PromptRepository };
