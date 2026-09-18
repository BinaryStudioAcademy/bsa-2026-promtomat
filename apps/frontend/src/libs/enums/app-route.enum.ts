const AppRoute = {
	ANY: "*",
	GENERATE: "/generate",
	NO_ACCESS: "/no-access",
	PROFILE: "/profile",
	PROMPTS_$PROMPT_ID: "/prompts/:promptId",
	PROMPTS_HISTORY: "/prompts/history",
	ROOT: "/",
	SETTINGS: "/settings",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
	TRAINING: "/training",
	WORKSPACES: "/workspaces",
} as const;

export { AppRoute };
