const APIPath = {
	ANALYTICS: "/analytics",
	AUTH: "/auth",
	COMPOSED_PROMPTS: "/composed-prompts",
	EVALUATIONS: "/evaluations",
	HEALTH: "/health",
	LABELS: "/labels",
	PROMPTS: "/prompts",
	USERS: "/users",
	WORKSPACES: "/workspaces",
	WORKSPACES_$WORKSPACE_ID: "/workspaces/:workspaceId",
} as const;

export { APIPath };
