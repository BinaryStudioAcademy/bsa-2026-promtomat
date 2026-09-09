import { z } from "zod";

import { PromptScope, PromptValidationRule } from "../enums/enums.js";

const promptGetQuery = z.object({
	limit: z.coerce.number().int().positive().optional(),
	page: z.coerce.number().int().positive().optional(),
	scope: z.enum([PromptScope.MINE, PromptScope.ALL]),
	score: z.coerce
		.number()
		.int()
		.min(PromptValidationRule.EFFICIENCY_SCORE_MIN)
		.max(PromptValidationRule.EFFICIENCY_SCORE_MAX)
		.optional(),
	search: z.string().trim().optional(),
	workspaceId: z.coerce.number().int().positive().optional(),
});

export { promptGetQuery };
