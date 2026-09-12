import { type Knex } from "knex";

const TableName = {
	COMPOSED_PROMPTS: "composed_prompts",
	USERS: "users",
	WORKSPACES: "workspaces",
} as const;

const DELETE_STRATEGY = "CASCADE";

const DESCRIPTION_HASH_LENGTH = 64;

const ColumnName = {
	BODY: "body",
	CREATED_AT: "created_at",
	DESCRIPTION: "description",
	DESCRIPTION_HASH: "description_hash",
	EXPLANATION: "explanation",
	ID: "id",
	MODEL_ID: "model_id",
	REQUESTER_ID: "requester_id",
	UPDATED_AT: "updated_at",
	WORKSPACE_ID: "workspace_id",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.COMPOSED_PROMPTS);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableName.COMPOSED_PROMPTS, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.integer(ColumnName.WORKSPACE_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.WORKSPACES)
			.onDelete(DELETE_STRATEGY);
		table
			.integer(ColumnName.REQUESTER_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.USERS)
			.onDelete(DELETE_STRATEGY);
		table.text(ColumnName.DESCRIPTION).notNullable();
		table
			.string(ColumnName.DESCRIPTION_HASH, DESCRIPTION_HASH_LENGTH)
			.notNullable();
		table.text(ColumnName.BODY).notNullable();
		table.text(ColumnName.EXPLANATION).notNullable();
		table.string(ColumnName.MODEL_ID).notNullable();
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table.unique([ColumnName.WORKSPACE_ID, ColumnName.DESCRIPTION_HASH]);
	});
}

export { down, up };
