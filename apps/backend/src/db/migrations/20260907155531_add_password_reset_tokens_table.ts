import { type Knex } from "knex";

const TABLE_NAME = "password_reset_tokens";

const USERS_TABLE_NAME = "users";

const ColumnName = {
	CREATED_AT: "created_at",
	EXPIRES_AT: "expires_at",
	ID: "id",
	TOKEN_HASH: "token_hash",
	UPDATED_AT: "updated_at",
	USER_ID: "user_id",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(TABLE_NAME);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TABLE_NAME, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.integer(ColumnName.USER_ID)
			.notNullable()
			.unique()
			.references("id")
			.inTable(USERS_TABLE_NAME)
			.onDelete("CASCADE");
		table.string(ColumnName.TOKEN_HASH).notNullable().unique();
		table.dateTime(ColumnName.EXPIRES_AT).notNullable();
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
	});
}

export { down, up };
