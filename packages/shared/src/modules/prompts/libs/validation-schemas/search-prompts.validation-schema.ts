import { z } from "zod";

import {
	SearchValidationMessage,
	SearchValidationRule,
} from "../enums/enums.js";

const searchPrompts = z.object({
	description: z
		.string()
		.trim()
		.min(
			SearchValidationRule.DESCRIPTION_MIN_LENGTH,
			SearchValidationMessage.DESCRIPTION_TOO_SHORT,
		)
		.max(
			SearchValidationRule.DESCRIPTION_MAX_LENGTH,
			SearchValidationMessage.DESCRIPTION_TOO_LONG,
		),
	workspaceId: z.coerce.number().int().positive(),
});

export { searchPrompts };
