import { z } from "zod";

import { TokenValidationMessage, TokenValidationRule } from "../enums/enums.js";

const tokenCreateValidationSchema = z.object({
	name: z
		.string()
		.trim()
		.min(
			TokenValidationRule.NAME_MIN_LENGTH,
			TokenValidationMessage.NAME_MIN_LENGTH,
		)
		.max(
			TokenValidationRule.NAME_MAX_LENGTH,
			TokenValidationMessage.NAME_MAX_LENGTH,
		),
});

export { tokenCreateValidationSchema };
