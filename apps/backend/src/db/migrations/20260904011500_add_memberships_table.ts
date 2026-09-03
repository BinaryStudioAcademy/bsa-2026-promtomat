import { type Knex } from "knex";

import { DatabaseTableName } from "../../libs/modules/database/database.js";

const TABLE_NAME = DatabaseTableName.MEMBERSHIPS;

const ColumnName = {
	CREATED_AT: "created_at",
	ID: "id",
	ROLE: "role",
	UPDATED_AT: "updated_at",
	USER_ID: "user_id",
	WORKSPACE_ID: "workspace_id",
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

		table
			.integer(ColumnName.WORKSPACE_ID)
			.notNullable()
			.references("id")
			.inTable(DatabaseTableName.WORKSPACES);

		table.string(ColumnName.ROLE).notNullable();

		table.unique([ColumnName.USER_ID, ColumnName.WORKSPACE_ID]);

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
