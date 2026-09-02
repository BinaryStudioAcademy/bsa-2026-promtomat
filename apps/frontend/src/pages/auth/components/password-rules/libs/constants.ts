import {
	AuthValidationMessage,
	AuthValidationRule,
	passwordBoundarySpacesValidationSchema,
	passwordLengthValidationSchema,
} from "~/modules/auth/auth.js";

const PASSWORD_RULES = [
	{
		label: `Between ${String(AuthValidationRule.PASSWORD_MINIMUM_LENGTH)} and ${String(AuthValidationRule.PASSWORD_MAXIMUM_LENGTH)} characters`,
		validationSchema: passwordLengthValidationSchema,
	},
	{
		label: AuthValidationMessage.PASSWORD_HAS_LEADING_OR_TRAILING_SPACES,
		validationSchema: passwordBoundarySpacesValidationSchema,
	},
] as const;

export { PASSWORD_RULES };
