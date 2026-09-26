import { type Knex } from "knex";

const TABLE_NAME = "prompts";

const ColumnName = {
	CREATED_AT: "created_at",
	USER_ID: "user_id",
} as const;

const INDEX_NAME = "prompts_user_id_created_at_index";

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropIndex([ColumnName.USER_ID, ColumnName.CREATED_AT], INDEX_NAME);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.index([ColumnName.USER_ID, ColumnName.CREATED_AT], INDEX_NAME);
	});
}

export { down, up };
