import { type Knex } from "knex";

const TableName = {
	COMPOSED_PROMPTS: "composed_prompts",
	PROMPTS: "prompts",
} as const;

const ColumnName = {
	COMPUTED_SCORE: "computed_score",
} as const;

const SCORE_DECIMAL_PRECISION = 4;
const SCORE_DECIMAL_SCALE = 2;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.PROMPTS, (table) => {
		table.dropColumn(ColumnName.COMPUTED_SCORE);
	});
	await knex.schema.alterTable(TableName.COMPOSED_PROMPTS, (table) => {
		table.dropColumn(ColumnName.COMPUTED_SCORE);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.PROMPTS, (table) => {
		table
			.decimal(
				ColumnName.COMPUTED_SCORE,
				SCORE_DECIMAL_PRECISION,
				SCORE_DECIMAL_SCALE,
			)
			.nullable();
	});
	await knex.raw(
		"ALTER TABLE ?? ADD CONSTRAINT prompts_computed_score_check CHECK (computed_score >= 1 AND computed_score <= 10)",
		[TableName.PROMPTS],
	);

	await knex.schema.alterTable(TableName.COMPOSED_PROMPTS, (table) => {
		table
			.decimal(
				ColumnName.COMPUTED_SCORE,
				SCORE_DECIMAL_PRECISION,
				SCORE_DECIMAL_SCALE,
			)
			.nullable();
	});
	await knex.raw(
		"ALTER TABLE ?? ADD CONSTRAINT composed_prompts_computed_score_check CHECK (computed_score >= 1 AND computed_score <= 10)",
		[TableName.COMPOSED_PROMPTS],
	);
}

export { down, up };
