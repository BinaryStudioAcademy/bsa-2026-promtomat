const AuthErrorMessages = {
	INVALID_PAYLOAD: "TokenService payload is invalid.",
	INVALID_TOKEN: "Token is invalid or expired.",
	MISSING_TOKEN: "Missing bearer token.",
	SESSION_NOT_VERIFIABLE:
		"Your session could not be verified. Please sign in again.",
	USER_NOT_FOUND: "User no longer exists.",
	WRONG_PURPOSE: "This token cannot be used to authenticate.",
} as const;

export { AuthErrorMessages };
