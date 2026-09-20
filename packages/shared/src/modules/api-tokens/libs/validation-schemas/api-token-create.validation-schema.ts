import { z } from "zod";

import {
	ApiTokenValidationMessage,
	ApiTokenValidationRule,
} from "../enums/enums.js";

const apiTokenCreateValidationSchema = z.object({
	name: z
		.string()
		.trim()
		.min(
			ApiTokenValidationRule.NAME_MIN_LENGTH,
			ApiTokenValidationMessage.NAME_MIN_LENGTH,
		)
		.max(
			ApiTokenValidationRule.NAME_MAX_LENGTH,
			ApiTokenValidationMessage.NAME_MAX_LENGTH,
		),
});

export { apiTokenCreateValidationSchema };
