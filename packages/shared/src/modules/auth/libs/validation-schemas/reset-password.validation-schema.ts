import { z } from "zod";

import { AuthValidationMessage } from "../enums/enums.js";
import { passwordField } from "./password-field.validation-schema.js";

const TOKEN_MINIMUM_LENGTH = 1;

const resetPassword = z
	.object({
		password: passwordField,
		token: z.string().trim().min(TOKEN_MINIMUM_LENGTH, {
			error: AuthValidationMessage.RESET_TOKEN_REQUIRED,
		}),
	})
	.required();

export { resetPassword };
