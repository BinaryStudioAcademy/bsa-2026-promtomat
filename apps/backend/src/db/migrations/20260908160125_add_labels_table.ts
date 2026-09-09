import type { Knex } from "knex";

const ON_DELETE_CASCADE = "Cascade";

const TableName = {
	LABELS: "labels",
	WORKSPACES: "workspaces",
};

const ColumnName = {
	CREATED_AT: "created_at",
	ID: "id",
	NAME: "name",
	UPDATED_AT: "updated_at",
	WORKSPACE_ID: "workspace_id",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(TableName.LABELS);
}

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TableName.LABELS, (table) => {
		table.increments(ColumnName.ID).primary().notNullable();
		table.string(ColumnName.NAME).notNullable();
		table.unique([ColumnName.WORKSPACE_ID, ColumnName.NAME]);

		table
			.integer(ColumnName.WORKSPACE_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.WORKSPACES)
			.onDelete(ON_DELETE_CASCADE);

		table
			.datetime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());

		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
	});
}

export { down, up };
