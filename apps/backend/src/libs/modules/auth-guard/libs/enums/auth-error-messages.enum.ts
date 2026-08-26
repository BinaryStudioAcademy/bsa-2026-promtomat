const AuthErrorMesssage = {
	INVALID_TOKEN: "Token is invalid or expired.",
	MISSING_TOKEN: "Missing bearer token.",
	USER_NOT_FOUND: "User no longer exists.",
} as const;

export { AuthErrorMesssage };
