import { z } from "zod";

import { PromptQualityTier, PromptValidationRule } from "../enums/enums.js";

type PromptQualityTierValue =
	(typeof PromptQualityTier)[keyof typeof PromptQualityTier];

const promptGetQuery = z.object({
	limit: z.coerce
		.number()
		.int()
		.positive()
		.max(PromptValidationRule.MAX_LIMIT)
		.optional(),
	page: z.coerce.number().int().positive().optional(),
	qualityTier: z
		.enum(
			Object.values(PromptQualityTier) as [
				PromptQualityTierValue,
				...PromptQualityTierValue[],
			],
		)
		.optional(),
	search: z.string().trim().optional(),
	workspaceId: z.coerce.number().int().positive().optional(),
});

export { promptGetQuery };
