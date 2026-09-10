const AppRoute = {
	ANY: "*",
	FORGOT_PASSWORD: "/forgot-password",
	NO_ACCESS: "/no-access",
	RESET_PASSWORD: "/reset-password",
	ROOT: "/",
	SETTINGS: "/settings",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
	TRAINING: "/training",
	WORKSPACES: "/workspaces",
} as const;

export { AppRoute };
