import { z } from "zod";

import { AuthValidationMessage, AuthValidationRule } from "../enums/enums.js";

const passwordField = z
	.string()
	.min(AuthValidationRule.PASSWORD_MINIMUM_LENGTH, {
		error: AuthValidationMessage.PASSWORD_TOO_SHORT,
	})
	.max(AuthValidationRule.PASSWORD_MAXIMUM_LENGTH, {
		error: AuthValidationMessage.PASSWORD_TOO_LONG,
	})
	.refine((value) => value === value.trim(), {
		error: AuthValidationMessage.PASSWORD_HAS_LEADING_OR_TRAILING_SPACES,
	});

export { passwordField };
