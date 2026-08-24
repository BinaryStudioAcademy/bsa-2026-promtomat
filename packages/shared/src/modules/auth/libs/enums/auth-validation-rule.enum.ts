const AuthValidationRule = {
	EMAIL_MINIMUM_LENGTH: 1,
	PASSWORD_MAXIMUM_LENGTH: 20,
	PASSWORD_MINIMUM_LENGTH: 4,
} as const;

export { AuthValidationRule };
