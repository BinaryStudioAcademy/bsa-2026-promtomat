import { type Knex } from "knex";

import { DatabaseTableName } from "../../libs/modules/database/database.js";

const TABLE_NAME = "prompts";

const ColumnName = {
	CREATED_AT: "created_at",
	EFFICIENCY_SCORE: "efficiency_score",
	ID: "id",
	PROMPT_BODY: "prompt_body",
	TASK_INTENT: "task_intent",
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
			.inTable(DatabaseTableName.USERS)
			.onDelete("CASCADE");
		table
			.integer(ColumnName.WORKSPACE_ID)
			.notNullable()
			.references("id")
			.inTable(DatabaseTableName.WORKSPACES)
			.onDelete("CASCADE");
		table.string(ColumnName.TASK_INTENT).notNullable();
		table.text(ColumnName.PROMPT_BODY).notNullable();
		table.integer(ColumnName.EFFICIENCY_SCORE).notNullable();
		table.check(
			"?? >= 1 AND ?? <= 10",
			[ColumnName.EFFICIENCY_SCORE, ColumnName.EFFICIENCY_SCORE],
			"prompts_efficiency_score_check",
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
