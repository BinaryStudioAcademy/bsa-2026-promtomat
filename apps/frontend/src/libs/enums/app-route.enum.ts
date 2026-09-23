const AppRoute = {
	ANALYTICS: "/analytics",
	ANY: "*",
	FORGOT_PASSWORD: "/forgot-password",
	GENERATE: "/generate",
	NO_ACCESS: "/no-access",
	PROFILE: "/profile",
	PROMPTS_$PROMPT_ID: "/prompts/:promptId",
	PROMPTS_HISTORY: "/prompts/history",
	RESET_PASSWORD: "/reset-password",
	ROOT: "/",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
	TRAINING: "/training",
	WORKSPACES: "/workspaces",
} as const;

export { AppRoute };
