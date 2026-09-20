import { z } from "zod";

import { emailField } from "./email-field.validation-schema.js";

const forgotPassword = z
	.object({
		email: emailField,
	})
	.required();

export { forgotPassword };
