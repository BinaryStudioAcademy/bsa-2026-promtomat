const AuthErrorMessage = {
	RESET_TOKEN_EXPIRED: "This link has expired. Request a new one.",
	RESET_TOKEN_INVALID: "This link is no longer valid. Request a new one.",
	UNAUTHORIZED: "You are not authorized",
} as const;

export { AuthErrorMessage };
