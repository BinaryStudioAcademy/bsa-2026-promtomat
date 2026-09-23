const AuthErrorMessage = {
	INVALID_PAYLOAD: "TokenService payload is invalid.",
	INVALID_TOKEN: "Token is invalid or expired.",
	MISSING_TOKEN: "Missing bearer token.",
	RESET_TOKEN_EXPIRED: "This link has expired. Request a new one.",
	RESET_TOKEN_INVALID: "This link is no longer valid. Request a new one.",
	SESSION_NOT_VERIFIABLE:
		"Your session could not be verified. Please sign in again.",
	UNAUTHORIZED: "You are not authorized",
	USER_NOT_FOUND: "User no longer exists.",
	WRONG_PURPOSE: "This token cannot be used to authenticate.",
} as const;

export { AuthErrorMessage };
