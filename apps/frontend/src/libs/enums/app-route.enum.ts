const AppRoute = {
	ANY: "*",
	NO_ACCESS: "/no-access",
	ROOT: "/",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
	WORKSPACES: "/workspaces",
} as const;

export { AppRoute };
