import { z } from "zod";

import { AuthValidationMessage, AuthValidationRule } from "../enums/enums.js";

const emailField = z
	.string()
	.trim()
	.toLowerCase()
	.min(AuthValidationRule.EMAIL_MINIMUM_LENGTH, {
		error: AuthValidationMessage.EMAIL_REQUIRED,
	})
	.pipe(
		z.email({
			error: AuthValidationMessage.EMAIL_INVALID,
		}),
	);

export { emailField };
