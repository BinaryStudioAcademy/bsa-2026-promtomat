const AuthErrorMesssage = {
	INVALID_PAYLOAD: "TokenService payload is invalid.",
	INVALID_TOKEN: "Token is invalid or expired.",
	MISSING_TOKEN: "Missing bearer token.",
	PASSWORD_CHANGED: "Your password was changed. Please sign in again.",
	USER_NOT_FOUND: "User no longer exists.",
	WRONG_PURPOSE: "This token cannot be used to authenticate.",
} as const;

export { AuthErrorMesssage };
