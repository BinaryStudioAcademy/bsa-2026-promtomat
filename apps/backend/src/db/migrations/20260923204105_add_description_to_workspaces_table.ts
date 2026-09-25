import { type Knex } from "knex";

const TABLE_NAME = "workspaces";

const ColumnName = {
	DESCRIPTION: "description",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.DESCRIPTION);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.string(ColumnName.DESCRIPTION).notNullable().defaultTo("");
	});
}

export { down, up };
