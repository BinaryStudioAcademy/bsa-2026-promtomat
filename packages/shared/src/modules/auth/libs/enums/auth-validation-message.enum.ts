const AuthValidationMessage = {
	EMAIL_INVALID: "Email is invalid",
	EMAIL_REQUIRED: "Email is required",
	PASSWORD_HAS_LEADING_OR_TRAILING_SPACES:
		"Password must not start or end with a space",
	PASSWORD_TOO_LONG: "Password must be at most :maximumLength characters",
	PASSWORD_TOO_SHORT: "Password must be at least :minimumLength characters",
} as const;

export { AuthValidationMessage };
