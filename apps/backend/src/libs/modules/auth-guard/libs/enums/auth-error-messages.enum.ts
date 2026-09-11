const AuthErrorMesssage = {
	INVALID_PAYLOAD: "TokenService payload is invalid.",
	INVALID_TOKEN: "Token is invalid or expired.",
	MISSING_TOKEN: "Missing bearer token.",
	USER_NOT_FOUND: "User no longer exists.",
	WRONG_PURPOSE: "This token cannot be used to authenticate.",
} as const;

export { AuthErrorMesssage };
