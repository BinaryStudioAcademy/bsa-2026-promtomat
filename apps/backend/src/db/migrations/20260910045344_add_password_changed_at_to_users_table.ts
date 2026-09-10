import { type Knex } from "knex";

const TABLE_NAME = "users";

const ColumnName = {
	PASSWORD_CHANGED_AT: "password_changed_at",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.PASSWORD_CHANGED_AT);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dateTime(ColumnName.PASSWORD_CHANGED_AT).nullable();
	});
}

export { down, up };
