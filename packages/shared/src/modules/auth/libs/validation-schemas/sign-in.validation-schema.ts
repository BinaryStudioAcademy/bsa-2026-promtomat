import { z } from "zod";

import { AuthValidationMessage, AuthValidationRule } from "../enums/enums.js";
import { emailField } from "./email-field.validation-schema.js";

const signIn = z
	.object({
		email: emailField,
		password: z
			.string()
			.trim()
			.min(AuthValidationRule.PASSWORD_SIGN_IN_MINIMUM_LENGTH, {
				error: AuthValidationMessage.PASSWORD_REQUIRED,
			}),
	})
	.required();

export { signIn };
