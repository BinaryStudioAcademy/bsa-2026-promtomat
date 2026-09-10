import { type Transaction } from "objection";

import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { LabelColumnName } from "~/modules/labels/libs/enums/enums.js";
import {
	FIRST_PAGE,
	LABEL_ALIAS,
	LABEL_ID,
	PROMPT_ID,
	PROMPT_LABEL_ID,
	PROMPT_WORKSPACE_ID,
} from "~/modules/prompts/libs/constants/constants.js";
import { PromptColumnName } from "~/modules/prompts/libs/enums/enums.js";
import {
	type PromptDto,
	type PromptFindByWorkspacePayload,
} from "~/modules/prompts/libs/types/types.js";
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

	public async findByWorkspace({
		labelId,
		page,
		size,
		workspaceId,
	}: PromptFindByWorkspacePayload): Promise<PromptDto[]> {
		const query = this.promptModel
			.knex()
			.select<PromptDto[]>(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE}`,
				PROMPT_ID,
				`${DatabaseTableName.LABELS}.${LabelColumnName.NAME} as ${LABEL_ALIAS}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.PROMPT_BODY}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.TASK_INTENT}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.USER_ID}`,
				PROMPT_WORKSPACE_ID,
			)
			.from(DatabaseTableName.PROMPTS)
			.offset((page - FIRST_PAGE) * size)
			.limit(size)
			.innerJoin(DatabaseTableName.LABELS, PROMPT_LABEL_ID, LABEL_ID)
			.where(PROMPT_WORKSPACE_ID, "=", workspaceId)
			.orderBy(PROMPT_ID, "desc");

		if (labelId !== undefined) {
			query.where(PROMPT_LABEL_ID, "=", labelId);
		}

		return await query;
	}

	public async findPromptsWithoutLabels(
		limit: number,
		afterId: number,
	): Promise<PromptEntity[]> {
		const prompts = await this.promptModel
			.query()
			.limit(limit)
			.whereNull(PromptColumnName.LABEL_ID)
			.orderBy(PromptColumnName.ID)
			.where(PromptColumnName.ID, ">", afterId)
			.execute();

		return prompts.map((prompt) => PromptEntity.initialize(prompt));
	}

	public async updateLabel(promptId: number, labelId: number): Promise<void> {
		await this.promptModel.query().findById(promptId).patch({ labelId });
	}
}

export { PromptRepository };
