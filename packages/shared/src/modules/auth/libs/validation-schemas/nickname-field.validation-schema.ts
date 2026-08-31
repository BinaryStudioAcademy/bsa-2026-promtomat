import { z } from "zod";

import { AuthValidationMessage, AuthValidationRule } from "../enums/enums.js";

const nicknameField = z
	.string()
	.trim()
	.min(AuthValidationRule.NICKNAME_EMPTY_STATE_LENGTH, {
		error: AuthValidationMessage.NICKNAME_REQUIRED,
	})
	.min(AuthValidationRule.NICKNAME_MINIMUM_LENGTH, {
		error: AuthValidationMessage.NICKNAME_TOO_SHORT,
	})
	.max(AuthValidationRule.NICKNAME_MAXIMUM_LENGTH, {
		error: AuthValidationMessage.NICKNAME_TOO_LONG,
	})
	.regex(AuthValidationRule.NICKNAME_REGEX, {
		error: AuthValidationMessage.NICKNAME_INVALID,
	});

export { nicknameField };
