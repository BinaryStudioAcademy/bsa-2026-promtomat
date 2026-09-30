import { z } from "zod";

import { PromptValidationRule } from "../../../prompts/libs/enums/enums.js";
import { PromptHistoryScoreTier } from "../enums/prompt-history-score-tier.enum.js";

type PromptHistoryScoreTierValue =
	(typeof PromptHistoryScoreTier)[keyof typeof PromptHistoryScoreTier];

const promptHistoryGetQuery = z.object({
	limit: z.coerce
		.number()
		.int()
		.positive()
		.max(PromptValidationRule.MAX_LIMIT)
		.optional(),
	page: z.coerce.number().int().positive().optional(),
	qualityTier: z
		.enum(
			Object.values(PromptHistoryScoreTier) as [
				PromptHistoryScoreTierValue,
				...PromptHistoryScoreTierValue[],
			],
		)
		.optional(),
	search: z.string().trim().optional(),
	workspaceId: z.coerce.number().int().positive(),
});

export { promptHistoryGetQuery };
