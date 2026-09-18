import { z } from "zod";

import { PromptQualityTier, PromptValidationRule } from "../enums/enums.js";

const promptGetQuery = z.object({
	limit: z.coerce
		.number()
		.int()
		.positive()
		.max(PromptValidationRule.MAX_LIMIT)
		.optional(),
	page: z.coerce.number().int().positive().optional(),
	qualityTier: z
		.enum([
			PromptQualityTier.ALL,
			PromptQualityTier.NEEDS_IMPROVEMENT,
			PromptQualityTier.PROVEN,
			PromptQualityTier.UNRATED,
			PromptQualityTier.USABLE,
		])
		.optional(),
	search: z.string().trim().optional(),
	workspaceId: z.coerce.number().int().positive().optional(),
});

export { promptGetQuery };
