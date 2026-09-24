const ApiTokenValidationMessage = {
	EXPIRATION_INVALID: "The expiration value is invalid",
	ID_INVALID: "Token id must be a valid UUID",
	NAME_MAX_LENGTH: "The name must not exceed 15 characters",
	NAME_MIN_LENGTH: "The name must be at least 4 characters",
} as const;

export { ApiTokenValidationMessage };
