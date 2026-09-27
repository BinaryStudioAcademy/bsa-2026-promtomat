import { type Knex } from "knex";

const TableName = {
	REPOSITORY_BINDINGS: "repository_bindings",
	WORKSPACES: "workspaces",
} as const;

const DELETE_STRATEGY = "CASCADE";

const ConstraintName = {
	WORKSPACE_ID_HOST_OWNER_REPO_UNIQUE:
		"repository_bindings_workspace_id_host_owner_repo_unique",
} as const;

const ColumnName = {
	CREATED_AT: "created_at",
	HOST: "host",
	ID: "id",
	OWNER: "owner",
	REPO: "repo",
	UPDATED_AT: "updated_at",
	WORKSPACE_ID: "workspace_id",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.REPOSITORY_BINDINGS);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableName.REPOSITORY_BINDINGS, (table) => {
		table.increments(ColumnName.ID).primary();

		table
			.integer(ColumnName.WORKSPACE_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.WORKSPACES)
			.onDelete(DELETE_STRATEGY);

		table.string(ColumnName.HOST).notNullable();
		table.string(ColumnName.OWNER).notNullable();
		table.string(ColumnName.REPO).notNullable();

		table.unique(
			[
				ColumnName.WORKSPACE_ID,
				ColumnName.HOST,
				ColumnName.OWNER,
				ColumnName.REPO,
			],
			{ indexName: ConstraintName.WORKSPACE_ID_HOST_OWNER_REPO_UNIQUE },
		);

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
