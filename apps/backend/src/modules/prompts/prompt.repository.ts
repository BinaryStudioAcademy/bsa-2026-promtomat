import { Transaction } from "objection";

import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";

class PromptRepository {
	private promptModel: typeof PromptModel;

	public constructor(promptModel: typeof PromptModel) {
		this.promptModel = promptModel;
	}

	public async create(
		entity: PromptEntity,
		trx?: Transaction,
	): Promise<PromptEntity> {
		const prompt = await this.promptModel
			.query(trx)
			.insert(entity.toNewObject())
			.returning("*")
			.execute();

		return PromptEntity.initialize(prompt);
	}
}

export { PromptRepository };
