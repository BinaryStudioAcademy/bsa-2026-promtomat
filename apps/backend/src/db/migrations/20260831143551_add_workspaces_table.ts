import { type Knex } from "knex";

const TableName = {
	USERS: "users",
	WORKSPACES: "workspaces",
} as const;

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
	return knex.schema.dropTableIfExists(TableName.WORKSPACES);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableName.WORKSPACES, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.integer(ColumnName.USER_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.USERS)
			.onDelete("CASCADE");
		table.string(ColumnName.NAME).notNullable();
		table
			.specificType(ColumnName.STACK_TAGS, "text[]")
			.notNullable()
			.defaultTo("{}");
		table.string(ColumnName.VISIBILITY).notNullable().defaultTo("private");
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

	await knex.raw(
		"INSERT INTO workspaces (visibility, user_id, name) SELECT 'private', id, nickname || ' workspace' FROM users;",
	);
}

export { down, up };
