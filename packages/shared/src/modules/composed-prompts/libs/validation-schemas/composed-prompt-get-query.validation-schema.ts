import { z } from "zod";

import { PromptValidationRule } from "../../../prompts/libs/enums/enums.js";

const composedPromptGetQuery = z.object({
	limit: z.coerce
		.number()
		.int()
		.positive()
		.max(PromptValidationRule.MAX_LIMIT)
		.optional(),
	page: z.coerce.number().int().positive().optional(),
	workspaceId: z.coerce.number().int().positive(),
});

export { composedPromptGetQuery };
