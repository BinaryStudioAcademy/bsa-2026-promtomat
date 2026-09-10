import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";

class PromptRepository {
	private promptModel: typeof PromptModel;

	public constructor(promptModel: typeof PromptModel) {
		this.promptModel = promptModel;
	}

	public async create(entity: PromptEntity): Promise<PromptEntity> {
		const prompt = await this.promptModel
			.query()
			.insert(entity.toNewObject())
			.returning("*")
			.execute();

		return PromptEntity.initialize(prompt);
	}

	public async findAllByIds(ids: number[]): Promise<PromptEntity[]> {
		const prompts = await this.promptModel.query().findByIds(ids).execute();

		return prompts.map((prompt) => PromptEntity.initialize(prompt));
	}
}

export { PromptRepository };
