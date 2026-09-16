import { z } from "zod";

import { PromptValidationRule } from "../../../prompts/libs/enums/enums.js";
import { ComposedPromptValidationMessage } from "../enums/enums.js";

const compose = z.object({
	description: z
		.string()
		.trim()
		.min(
			PromptValidationRule.INTENT_MINIMUM_LENGTH,
			ComposedPromptValidationMessage.DESCRIPTION_TOO_SHORT,
		)
		.max(
			PromptValidationRule.INTENT_MAXIMUM_LENGTH,
			ComposedPromptValidationMessage.DESCRIPTION_TOO_LONG,
		),
	workspaceId: z
		.number(ComposedPromptValidationMessage.INVALID_WORKSPACE)
		.int(ComposedPromptValidationMessage.INVALID_WORKSPACE)
		.positive(ComposedPromptValidationMessage.INVALID_WORKSPACE),
});

export { compose };
