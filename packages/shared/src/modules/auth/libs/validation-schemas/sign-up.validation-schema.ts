import { z } from "zod";

import { emailField } from "./email-field.validation-schema.js";
import { nicknameField } from "./nickname-field.validation-schema.js";
import { passwordField } from "./password-field.validation-schema.js";

const signUp = z.object({
	email: emailField,
	nickname: nicknameField,
	password: passwordField,
});

export { signUp };
