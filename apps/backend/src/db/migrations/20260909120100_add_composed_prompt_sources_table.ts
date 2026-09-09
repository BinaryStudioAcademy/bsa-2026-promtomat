import { type Knex } from "knex";

const TableName = {
	COMPOSED_PROMPT_SOURCES: "composed_prompt_sources",
	COMPOSED_PROMPTS: "composed_prompts",
	PROMPTS: "prompts",
} as const;

const DELETE_STRATEGY = "CASCADE";

const RANK_CHECK_NAME = "composed_prompt_sources_rank_check";

const MINIMUM_RANK = 1;

const ColumnName = {
	COMPOSED_PROMPT_ID: "composed_prompt_id",
	CREATED_AT: "created_at",
	ID: "id",
	PROMPT_ID: "prompt_id",
	RANK: "rank",
	UPDATED_AT: "updated_at",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.COMPOSED_PROMPT_SOURCES);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableName.COMPOSED_PROMPT_SOURCES, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.integer(ColumnName.COMPOSED_PROMPT_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.COMPOSED_PROMPTS)
			.onDelete(DELETE_STRATEGY);
		table
			.integer(ColumnName.PROMPT_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.PROMPTS)
			.onDelete(DELETE_STRATEGY);
		table.integer(ColumnName.RANK).notNullable();
		table.check("?? >= ?", [ColumnName.RANK, MINIMUM_RANK], RANK_CHECK_NAME);
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table.unique([ColumnName.COMPOSED_PROMPT_ID, ColumnName.PROMPT_ID]);
	});
}

export { down, up };
