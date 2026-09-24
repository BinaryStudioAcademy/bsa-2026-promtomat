const APIPath = {
	ANALYTICS: "/analytics",
	API_TOKENS: "/api-tokens",
	AUTH: "/auth",
	COMPOSED_PROMPTS: "/composed-prompts",
	HEALTH: "/health",
	LABELS: "/labels",
	PROMPTS: "/prompts",
	REPOSITORY_BINDINGS: "/repository-bindings",
	USERS: "/users",
	WORKSPACES: "/workspaces",
	WORKSPACES_$WORKSPACE_ID: "/workspaces/:workspaceId",
} as const;

export { APIPath };
