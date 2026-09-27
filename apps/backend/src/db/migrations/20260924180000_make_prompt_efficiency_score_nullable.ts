import { type Knex } from "knex";

const TableName = {
	PROMPTS: "prompts",
} as const;

const ColumnName = {
	EFFICIENCY_SCORE: "efficiency_score",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex(TableName.PROMPTS).whereNull(ColumnName.EFFICIENCY_SCORE).delete();

	await knex.schema.alterTable(TableName.PROMPTS, (table) => {
		table.integer(ColumnName.EFFICIENCY_SCORE).notNullable().alter();
	});
}

function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable(TableName.PROMPTS, (table) => {
		table.integer(ColumnName.EFFICIENCY_SCORE).nullable().alter();
	});
}

export { down, up };
