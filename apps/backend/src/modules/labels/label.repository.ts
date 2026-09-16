import { type Transaction } from "objection";

import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { LabelEntity } from "./label.entity.js";
import { type LabelModel } from "./label.model.js";
import {
	CREATE_LABEL_CONFLICT_COLUMNS,
	CREATE_LABEL_MERGE_COLUMNS,
} from "./libs/constants/constants.js";
import { TableColumn } from "./libs/enums/enums.js";
import {
	type LabelCountRow,
	type LabelStemRow,
	type LabelWithPromptCountDto,
} from "./libs/types/types.js";

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
	): Promise<LabelWithPromptCountDto[]> {
		const rows = (await this.labelModel
			.knex()
			.select(TableColumn.LABEL_ID, TableColumn.LABEL_NAME)
			.from(DatabaseTableName.LABELS)
			.leftJoin(
				DatabaseTableName.PROMPTS,
				TableColumn.LABEL_ID,
				TableColumn.PROMPT_LABEL_ID,
			)
			.where(TableColumn.LABEL_WORKSPACE_ID, "=", workspaceId)
			.count(`${TableColumn.PROMPT_ID} as ${TableColumn.PROMPT_COUNT_ALIAS}`)
			.groupBy(TableColumn.LABEL_ID, TableColumn.LABEL_NAME)
			.orderBy(TableColumn.PROMPT_COUNT_ALIAS, "desc")) as LabelCountRow[];

		return rows.map((row) => ({
			id: row.id,
			name: row.name,
			promptCount: Number(row.promptCount),
		}));
	}

	public async findStem(label: string, trx?: Transaction): Promise<string> {
		const knex = trx ?? this.labelModel.knex();

		const { rows } = await knex.raw<{ rows: LabelStemRow[] }>(
			"SELECT (ts_lexize('english_stem', ?))[1] AS stem",
			[label],
		);

		const [row] = rows;

		return row?.stem ?? label;
	}
}

export { LabelRepository };
