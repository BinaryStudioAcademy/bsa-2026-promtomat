import { z } from "zod";

import { AuthValidationMessage, AuthValidationRule } from "../enums/enums.js";

const passwordLength = z
	.string()
	.min(AuthValidationRule.PASSWORD_MINIMUM_LENGTH, {
		error: AuthValidationMessage.PASSWORD_TOO_SHORT,
	})
	.max(AuthValidationRule.PASSWORD_MAXIMUM_LENGTH, {
		error: AuthValidationMessage.PASSWORD_TOO_LONG,
	});

export { passwordLength };
