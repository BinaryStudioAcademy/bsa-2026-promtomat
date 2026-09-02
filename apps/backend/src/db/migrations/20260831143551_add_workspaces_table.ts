import { type Knex } from "knex";

import { DatabaseTableName } from "../../libs/modules/database/database.js";

const TABLE_NAME = "workspaces";

const ColumnName = {
	CREATED_AT: "created_at",
	ID: "id",
	NAME: "name",
	STACK_TAGS: "stack_tags",
	UPDATED_AT: "updated_at",
	USER_ID: "user_id",
	VISIBILITY: "visibility",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TABLE_NAME);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TABLE_NAME, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.integer(ColumnName.USER_ID)
			.notNullable()
			.references("id")
			.inTable(DatabaseTableName.USERS);
		table.string(ColumnName.NAME).notNullable();
		table
			.specificType(ColumnName.STACK_TAGS, "text[]")
			.notNullable()
			.defaultTo("{}");
		table.string(ColumnName.VISIBILITY).notNullable();
		table.unique([ColumnName.USER_ID, ColumnName.NAME]);
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
	});

	await knex.raw(
		"INSERT INTO workspaces (visibility, user_id, name, stack_tags) SELECT 'private', id, nickname || ' workspace', '{}'::text[] FROM users;",
	);
}

export { down, up };
