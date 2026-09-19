import { type Knex } from "knex";

const TableName = {
	CONTRIBUTORS: "contributors",
	USERS: "users",
	WORKSPACES: "workspaces",
} as const;

const DELETE_STRATEGY = "CASCADE";

const ConstraintName = {
	USER_ID_WORKSPACE_ID_UNIQUE: "contributors_user_id_workspace_id_unique",
} as const;

const ColumnName = {
	CREATED_AT: "created_at",
	ID: "id",
	UPDATED_AT: "updated_at",
	USER_ID: "user_id",
	WORKSPACE_ID: "workspace_id",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.CONTRIBUTORS);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableName.CONTRIBUTORS, (table) => {
		table.increments(ColumnName.ID).primary();

		table
			.integer(ColumnName.USER_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.USERS)
			.onDelete(DELETE_STRATEGY);

		table
			.integer(ColumnName.WORKSPACE_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.WORKSPACES)
			.onDelete(DELETE_STRATEGY);

		table.unique([ColumnName.USER_ID, ColumnName.WORKSPACE_ID], {
			indexName: ConstraintName.USER_ID_WORKSPACE_ID_UNIQUE,
		});

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
