import { type Transaction } from "objection";

import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { PromptColumnName } from "~/modules/prompts/libs/enums/enums.js";

import { LabelEntity } from "./label.entity.js";
import { type LabelModel } from "./label.model.js";
import {
	CREATE_LABEL_CONFLICT_COLUMNS,
	CREATE_LABEL_MERGE_COLUMNS,
} from "./libs/constants/constants.js";
import { LabelColumnName } from "./libs/enums/enums.js";
import { type LabelWithCountDto } from "./libs/types/types.js";

const LABEL_ID = `${DatabaseTableName.LABELS}.${LabelColumnName.ID}`;

const LABEL_NAME = `${DatabaseTableName.LABELS}.${LabelColumnName.NAME}`;

const LABEL_WORKSPACE_ID = `${DatabaseTableName.LABELS}.${LabelColumnName.WORKSPACE_ID}`;

const PROMPT_ID = `${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`;

const PROMPT_LABEL_ID = `${DatabaseTableName.PROMPTS}.${PromptColumnName.LABEL_ID}`;

const PROMPT_COUNT_ALIAS = "promptCount";

type LabelCountRow = {
	id: number;
	name: string;
	promptCount: string;
};

const USAGE_COUNT_ALIAS = "usageCount";

class LabelRepository {
	private labelModel: typeof LabelModel;

	public constructor(labelModel: typeof LabelModel) {
		this.labelModel = labelModel;
	}

	public async createIfAbsent(
		entity: LabelEntity,
		trx?: Transaction,
	): Promise<LabelEntity> {
		const label = await this.labelModel
			.query(trx)
			.insert(entity.toNewObject())
			.onConflict(CREATE_LABEL_CONFLICT_COLUMNS)
			.merge(CREATE_LABEL_MERGE_COLUMNS)
			.returning("*")
			.execute();

		return LabelEntity.initialize(label);
	}

	public async findAllWithPromptCounts(
		workspaceId: number,
	): Promise<LabelWithCountDto[]> {
		const rows = (await this.labelModel
			.knex()
			.select(LABEL_ID, LABEL_NAME)
			.from(DatabaseTableName.LABELS)
			.leftJoin(DatabaseTableName.PROMPTS, LABEL_ID, PROMPT_LABEL_ID)
			.where(LABEL_WORKSPACE_ID, "=", workspaceId)
			.count(`${PROMPT_ID} as ${PROMPT_COUNT_ALIAS}`)
			.groupBy(LABEL_ID, LABEL_NAME)
			.orderBy(PROMPT_COUNT_ALIAS, "desc")) as LabelCountRow[];

		return rows.map((row) => ({
			id: row.id,
			name: row.name,
			promptCount: Number(row.promptCount),
		}));
	}

	public async findMostUsedNames(
		workspaceId: number,
		limit: number,
	): Promise<string[]> {
		const mostUsedLabels = await this.labelModel
			.query()
			.select(LABEL_NAME)
			.innerJoin(DatabaseTableName.PROMPTS, LABEL_ID, PROMPT_LABEL_ID)
			.where(LABEL_WORKSPACE_ID, "=", workspaceId)
			.count(`${PROMPT_ID} as ${USAGE_COUNT_ALIAS}`)
			.groupBy(LABEL_ID, LABEL_NAME)
			.orderBy(USAGE_COUNT_ALIAS, "desc")
			.limit(limit);

		return mostUsedLabels.map((label) => label.name);
	}
}

export { LabelRepository };
