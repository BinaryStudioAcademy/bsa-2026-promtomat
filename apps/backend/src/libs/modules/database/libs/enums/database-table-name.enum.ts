const DatabaseTableName = {
	MIGRATIONS: "migrations",
	PASSWORD_RESET_TOKENS: "password_reset_tokens",
	PROMPT_EMBEDDINGS: "prompt_embeddings",
	PROMPTS: "prompts",
	USERS: "users",
	WORKSPACES: "workspaces",
} as const;

export { DatabaseTableName };
