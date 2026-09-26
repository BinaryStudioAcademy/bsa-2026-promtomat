const DatabaseTableName = {
	API_TOKENS: "api_tokens",
	COMPOSED_PROMPT_SOURCES: "composed_prompt_sources",
	COMPOSED_PROMPTS: "composed_prompts",
	CONTRIBUTORS: "contributors",
	LABELS: "labels",
	MIGRATIONS: "migrations",
	PROMPT_EMBEDDINGS: "prompt_embeddings",
	PROMPTS: "prompts",
	REPOSITORY_BINDINGS: "repository_bindings",
	USERS: "users",
	WORKSPACES: "workspaces",
} as const;

export { DatabaseTableName };
