import { z } from "zod";

import { configureString } from "../../../../libs/helpers/helpers.js";
import { AuthValidationMessage, AuthValidationRule } from "../enums/enums.js";

const passwordField = z
	.string()
	.min(AuthValidationRule.PASSWORD_MINIMUM_LENGTH, {
		error: configureString(AuthValidationMessage.PASSWORD_TOO_SHORT, {
			minimumLength: String(AuthValidationRule.PASSWORD_MINIMUM_LENGTH),
		}),
	})
	.max(AuthValidationRule.PASSWORD_MAXIMUM_LENGTH, {
		error: configureString(AuthValidationMessage.PASSWORD_TOO_LONG, {
			maximumLength: String(AuthValidationRule.PASSWORD_MAXIMUM_LENGTH),
		}),
	})
	.refine((value) => value === value.trim(), {
		error: AuthValidationMessage.PASSWORD_HAS_LEADING_OR_TRAILING_SPACES,
	});

export { passwordField };
