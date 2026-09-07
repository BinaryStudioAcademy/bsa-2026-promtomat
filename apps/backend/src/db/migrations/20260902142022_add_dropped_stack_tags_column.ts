import type { Knex } from "knex";

const TABLE_NAME = "workspaces";

const ColumnName = {
	DROPPED_STACK_TAGS: "dropped_stack_tags",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.DROPPED_STACK_TAGS);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.specificType(ColumnName.DROPPED_STACK_TAGS, "text[]").nullable();
	});
}

export { down, up };
