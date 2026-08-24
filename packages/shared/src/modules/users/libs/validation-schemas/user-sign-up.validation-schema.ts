import { z } from "zod";

import { UserValidationMessage, UserValidationRule } from "../enums/enums.js";

const userSignUp = z
	.object({
		email: z
			.string()
			.trim()
			.min(UserValidationRule.EMAIL_MINIMUM_LENGTH, {
				error: UserValidationMessage.EMAIL_REQUIRE,
			})
			.pipe(
				z.email({
					error: UserValidationMessage.EMAIL_WRONG,
				}),
			),
		password: z
			.string()
			.trim()
			.min(UserValidationRule.PASSWORD_SIGN_IN_MINIMUM_LENGTH, {
				error: UserValidationMessage.PASSWORD_REQUIRE,
			}),
	})
	.required();

export { userSignUp };
