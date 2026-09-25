const AppRoute = {
	ANALYTICS: "/analytics",
	ANY: "*",
	API_TOKENS: "/api-tokens",
	FORGOT_PASSWORD: "/forgot-password",
	GENERATE: "/generate",
	NO_ACCESS: "/no-access",
	PROFILE: "/profile",
	PROMPTS_$PROMPT_ID: "/prompts/:promptId",
	RESET_PASSWORD: "/reset-password",
	ROOT: "/",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
	SMART_SEARCH: "/smart-search",
	TRAINING: "/training",
	WORKSPACES: "/workspaces",
	WORKSPACES_$WORKSPACE_ID_CONFIG: "/workspaces/:workspaceId/config",
} as const;

export { AppRoute };
