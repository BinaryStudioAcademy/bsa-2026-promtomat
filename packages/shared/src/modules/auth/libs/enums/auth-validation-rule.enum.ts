const AuthValidationRule = {
	EMAIL_MINIMUM_LENGTH: 1,
	PASSWORD_MAXIMUM_LENGTH: 64,
	PASSWORD_MINIMUM_LENGTH: 4,
} as const;

export { AuthValidationRule };
