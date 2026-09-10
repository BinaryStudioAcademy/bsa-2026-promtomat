const AppRoute = {
	ANY: "*",
	NO_ACCESS: "/no-access",
	PROFILE: "/profile",
	PROMPT_HISTORY: "/history",
	ROOT: "/",
	SETTINGS: "/settings",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
	TRAINING: "/training",
	WORKSPACES: "/workspaces",
} as const;

export { AppRoute };
