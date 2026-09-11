import { type Knex } from "knex";

const TABLE_NAME = "password_reset_tokens";

const ColumnName = {
	CREATED_AT: "created_at",
	EXPIRES_AT: "expires_at",
	ID: "id",
	TOKEN_HASH: "token_hash",
	UPDATED_AT: "updated_at",
	USER_ID: "user_id",
} as const;

const USERS_TABLE_NAME = "users";

// Reset links are now signed tokens rather than stored rows, so the table has
// no reader. Dropping it destroys any pending reset requests: a user who has
// asked for a link and not yet used it has to request another one. The links
// themselves keep working, since their validity comes from the signature.
async function down(knex: Knex): Promise<void> {
	await knex.schema.createTable(TABLE_NAME, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.integer(ColumnName.USER_ID)
			.notNullable()
			.unique()
			.references(ColumnName.ID)
			.inTable(USERS_TABLE_NAME)
			.onDelete("CASCADE");
		table.string(ColumnName.TOKEN_HASH).notNullable().unique();
		table.timestamp(ColumnName.EXPIRES_AT).notNullable();
		table
			.timestamp(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.timestamp(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(TABLE_NAME);
}

export { down, up };
