import { AuthValidationRule } from "./auth-validation-rule.enum.js";

const AuthValidationMessage = {
	EMAIL_INVALID: "Email is invalid",
	EMAIL_REQUIRED: "Email is required",
	PASSWORD_HAS_LEADING_OR_TRAILING_SPACES:
		"Password must not start or end with a space",
	PASSWORD_REQUIRED: "Password is required",
	PASSWORD_TOO_LONG: `Password must be at most ${String(AuthValidationRule.PASSWORD_MAXIMUM_LENGTH)} characters`,
	PASSWORD_TOO_SHORT: `Password must be at least ${String(AuthValidationRule.PASSWORD_MINIMUM_LENGTH)} characters`,
} as const;

export { AuthValidationMessage };
