import { z } from "zod";

import {
	PromptValidationMessage,
	PromptValidationRule,
} from "../enums/enums.js";

const promptCreate = z.object({
	efficiencyScore: z
		.number()
		.int()
		.min(PromptValidationRule.EFFICIENCY_SCORE_MIN)
		.max(PromptValidationRule.EFFICIENCY_SCORE_MAX),
	promptBody: z
		.string()
		.trim()
		.min(
			PromptValidationRule.BODY_MINIMUM_LENGTH,
			PromptValidationMessage.BODY_REQUIRED,
		),
	taskIntent: z
		.string()
		.trim()
		.min(
			PromptValidationRule.INTENT_MINIMUM_LENGTH,
			PromptValidationMessage.INTENT_REQUIRED,
		),
	workspaceId: z.number(),
});

export { promptCreate };
