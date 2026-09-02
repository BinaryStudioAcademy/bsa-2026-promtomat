import { type Knex } from "knex";

const TABLE_NAME = "users";

const ColumnName = {
	PRIMARY_AI_CODING_TOOL: "primary_ai_coding_tool",
} as const;

const PRIMARY_AI_CODING_TOOL_MAX_LENGTH = 30;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.PRIMARY_AI_CODING_TOOL);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table
			.string(
				ColumnName.PRIMARY_AI_CODING_TOOL,
				PRIMARY_AI_CODING_TOOL_MAX_LENGTH,
			)
			.nullable();
	});
}

export { down, up };
