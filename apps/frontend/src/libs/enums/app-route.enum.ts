const AppRoute = {
	ANALYTICS: "/analytics",
	ANY: "*",
	FORGOT_PASSWORD: "/forgot-password",
	GENERATE: "/generate",
	NO_ACCESS: "/no-access",
	PROFILE: "/profile",
	PROMPTS_$PROMPT_ID: "/prompts/:promptId",
	RESET_PASSWORD: "/reset-password",
	ROOT: "/",
	SETTINGS: "/settings",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
	SMART_SEARCH: "/smart-search",
	TRAINING: "/training",
	WORKSPACES: "/workspaces",
} as const;

export { AppRoute };
