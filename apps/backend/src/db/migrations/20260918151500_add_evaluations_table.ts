import { type Knex } from "knex";

const TableName = {
	COMPOSED_PROMPTS: "composed_prompts",
	EVALUATIONS: "evaluations",
	PROMPTS: "prompts",
	USERS: "users",
} as const;

const DELETE_STRATEGY = "CASCADE";

const ColumnName = {
	COMPOSED_PROMPT_ID: "composed_prompt_id",
	CREATED_AT: "created_at",
	ID: "id",
	PROMPT_ID: "prompt_id",
	SCORE: "score",
	UPDATED_AT: "updated_at",
	USER_ID: "user_id",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.EVALUATIONS);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableName.EVALUATIONS, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.integer(ColumnName.USER_ID)
			.unsigned()
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.USERS)
			.onDelete(DELETE_STRATEGY);
		table
			.integer(ColumnName.PROMPT_ID)
			.unsigned()
			.nullable()
			.references(ColumnName.ID)
			.inTable(TableName.PROMPTS)
			.onDelete(DELETE_STRATEGY);
		table
			.integer(ColumnName.COMPOSED_PROMPT_ID)
			.unsigned()
			.nullable()
			.references(ColumnName.ID)
			.inTable(TableName.COMPOSED_PROMPTS)
			.onDelete(DELETE_STRATEGY);
		table.integer(ColumnName.SCORE).notNullable();
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
		"ALTER TABLE ?? ADD CONSTRAINT evaluations_score_check CHECK (score >= 1 AND score <= 10), ADD CONSTRAINT evaluations_target_check CHECK (num_nonnulls(prompt_id, composed_prompt_id) = 1)",
		[TableName.EVALUATIONS],
	);

	await knex.raw(
		"CREATE UNIQUE INDEX eval_prompt_user_idx ON ?? (user_id, prompt_id) WHERE prompt_id IS NOT NULL",
		[TableName.EVALUATIONS],
	);

	await knex.raw(
		"CREATE UNIQUE INDEX eval_composed_user_idx ON ?? (user_id, composed_prompt_id) WHERE composed_prompt_id IS NOT NULL",
		[TableName.EVALUATIONS],
	);
}

export { down, up };
