import { z } from "zod";

import { AuthValidationMessage } from "../enums/enums.js";
import { passwordField } from "./password-field.validation-schema.js";

const newPassword = z
	.object({
		confirmPassword: passwordField,
		password: passwordField,
	})
	.required()
	.refine((values) => values.confirmPassword === values.password, {
		error: AuthValidationMessage.PASSWORDS_DO_NOT_MATCH,
		path: ["confirmPassword"],
	});

export { newPassword };
