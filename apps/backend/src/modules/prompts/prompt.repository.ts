import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";

import { EMPTY_WORKSPACE_ID_LIST_LENGTH } from "./libs/constants/prompt.constant.js";

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

	public async findCountsByWorkspaceIds(
		workspaceIds: number[],
	): Promise<Map<number, number>> {
		if (workspaceIds.length === EMPTY_WORKSPACE_ID_LIST_LENGTH) {
			return new Map();
		}
		const promptCounts = await this.promptModel
			.query()
			.select("workspaceId")
			.whereIn("workspaceId", workspaceIds)
			.count("* as promptCount")
			.groupBy("workspaceId")
			.castTo<
				Array<{
					promptCount: string;
					workspaceId: number;
				}>
			>()
			.execute();

		const promptCountsByWorkspaceId = new Map(
			promptCounts.map(
				({ promptCount, workspaceId }) =>
					[workspaceId, Number(promptCount)] as const,
			),
		);

		return promptCountsByWorkspaceId;
	}
}

export { PromptRepository };
