import { SortOrder } from "~/libs/enums/enums.js";
import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";

import { type PromptRecentDto } from "./libs/types/types.js";

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

	public async findCountByWorkspaceId(workspaceId: number): Promise<number> {
		return await this.promptModel.query().where({ workspaceId }).resultSize();
	}

	public async findRecentByWorkspaceId(
		workspaceId: number,
		limit: number,
	): Promise<PromptRecentDto[]> {
		return await this.promptModel
			.query()
			.select("efficiencyScore", "id", "taskIntent")
			.where({ workspaceId })
			.orderBy("createdAt", SortOrder.DESC)
			.limit(limit)
			.execute();
	}
}

export { PromptRepository };
