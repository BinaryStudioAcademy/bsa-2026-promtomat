import type { Knex } from "knex";

const TableName = {
	LABELS: "labels",
	PROMPTS: "prompts",
} as const;

const ColumnName = {
	ID: "id",
	LABEL_ID: "label_id",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.PROMPTS, (table) => {
		table.dropForeignIfExists(ColumnName.LABEL_ID);
	});
}

function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable(TableName.PROMPTS, (table) => {
		table
			.foreign(ColumnName.LABEL_ID)
			.references(ColumnName.ID)
			.inTable(TableName.LABELS);
	});
}

export { down, up };
