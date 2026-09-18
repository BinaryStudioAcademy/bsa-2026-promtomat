import { type Knex } from "knex";

const TableName = {
	API_TOKENS: "api_tokens",
	USERS: "users",
} as const;

const DELETE_STRATEGY = "CASCADE";

const ColumnName = {
	CREATED_AT: "created_at",
	ID: "id",
	LAST_USED_AT: "last_used_at",
	NAME: "name",
	PUBLIC_ID: "public_id",
	TOKEN_HASH: "token_hash",
	UPDATED_AT: "updated_at",
	USER_ID: "user_id",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.API_TOKENS);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableName.API_TOKENS, (table) => {
		table.increments(ColumnName.ID).primary();
		table.uuid(ColumnName.PUBLIC_ID).notNullable().unique();
		table
			.integer(ColumnName.USER_ID)
			.notNullable()
			.index()
			.references(ColumnName.ID)
			.inTable(TableName.USERS)
			.onDelete(DELETE_STRATEGY);
		table.string(ColumnName.NAME).notNullable();
		table.string(ColumnName.TOKEN_HASH).notNullable();
		table.dateTime(ColumnName.LAST_USED_AT).nullable();
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table.unique([ColumnName.USER_ID, ColumnName.NAME]);
	});
}

export { down, up };
