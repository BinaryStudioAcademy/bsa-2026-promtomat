const AppRoute = {
	ANY: "*",
	NO_ACCESS: "/no-access",
	ROOT: "/",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
	WORKSPACES: "/workspace",
} as const;

export { AppRoute };
