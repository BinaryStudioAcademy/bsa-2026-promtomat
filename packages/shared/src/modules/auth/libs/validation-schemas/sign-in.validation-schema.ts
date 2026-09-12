import { z } from "zod";

import { emailField } from "./email-field.validation-schema.js";
import { passwordField } from "./password-field.validation-schema.js";

const signIn = z
	.object({
		email: emailField,
		password: passwordField,
	})
	.required();

export { signIn };
