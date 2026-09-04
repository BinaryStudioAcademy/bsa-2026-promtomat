import { type Knex } from "knex";

const TABLE_NAME = "users";

const ColumnName = {
	PRIMARY_AI_CODING_TOOL: "primary_ai_coding_tool",
} as const;

const AiCodingTool = {
	CHATGPT: "CHATGPT",
	CLAUDE_CODE: "CLAUDE_CODE",
	CURSOR: "CURSOR",
	GEMINI: "GEMINI",
	GITHUB_COPILOT: "GITHUB_COPILOT",
	JETBRAINS_AI: "JETBRAINS_AI",
	WINDSURF: "WINDSURF",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.PRIMARY_AI_CODING_TOOL);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table
			.enu(ColumnName.PRIMARY_AI_CODING_TOOL, Object.values(AiCodingTool))
			.nullable();
	});
}

export { down, up };
