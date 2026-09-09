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
		)
		.max(
			PromptValidationRule.BODY_MAXIMUM_LENGTH,
			PromptValidationMessage.BODY_TOO_LONG,
		),
	taskIntent: z
		.string()
		.trim()
		.min(
			PromptValidationRule.INTENT_MINIMUM_LENGTH,
			PromptValidationMessage.INTENT_TOO_SHORT,
		)
		.max(
			PromptValidationRule.INTENT_MAXIMUM_LENGTH,
			PromptValidationMessage.INTENT_TOO_LONG,
		),
	workspaceId: z.number(PromptValidationMessage.INVALID_CONTEXT),
});

export { promptCreate };
