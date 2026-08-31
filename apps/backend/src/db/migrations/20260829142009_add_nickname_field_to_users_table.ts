import { type Knex } from "knex";

const TABLE_NAME = "users";

const ColumnName = {
	NICKNAME: "nickname",
} as const;

const NICKNAME_MAX_LENGTH = 25;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.NICKNAME);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.string(ColumnName.NICKNAME, NICKNAME_MAX_LENGTH).nullable();
	});

	await knex(TABLE_NAME)
		.whereNull(ColumnName.NICKNAME)
		.update({
			[ColumnName.NICKNAME]: knex.raw("CONCAT('user_', id)"),
		});

	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table
			.string(ColumnName.NICKNAME, NICKNAME_MAX_LENGTH)
			.notNullable()
			.unique()
			.alter();
	});
}

export { down, up };
