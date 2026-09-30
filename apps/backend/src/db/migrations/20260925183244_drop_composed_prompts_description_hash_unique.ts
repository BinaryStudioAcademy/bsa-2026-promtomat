import { type Knex } from "knex";

const TABLE_NAME = "composed_prompts";

const ColumnName = {
	DESCRIPTION_HASH: "description_hash",
	WORKSPACE_ID: "workspace_id",
} as const;

const DEDUPLICATION_COLUMNS = [
	ColumnName.WORKSPACE_ID,
	ColumnName.DESCRIPTION_HASH,
];

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropIndex(DEDUPLICATION_COLUMNS);
		table.unique(DEDUPLICATION_COLUMNS);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropUnique(DEDUPLICATION_COLUMNS);
		table.index(DEDUPLICATION_COLUMNS);
	});
}

export { down, up };
