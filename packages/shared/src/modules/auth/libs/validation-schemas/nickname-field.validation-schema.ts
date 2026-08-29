import { z } from "zod";

import { AuthValidationMessage, AuthValidationRule } from "../enums/enums.js";

const nicknameField = z
	.string()
	.trim()
	// Had to reuse EMAIL_MINIMUM_LENGTH for validation of an empty field in order
	// not to create a new constant
	.min(AuthValidationRule.EMAIL_MINIMUM_LENGTH, {
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
