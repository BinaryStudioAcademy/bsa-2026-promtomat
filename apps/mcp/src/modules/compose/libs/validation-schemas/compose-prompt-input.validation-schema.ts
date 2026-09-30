import { z } from "zod";

import { PromptValidationRule } from "../enums/enums.js";

const composePromptInput = {
	description: z
		.string()
		.trim()
		.min(PromptValidationRule.INTENT_MINIMUM_LENGTH)
		.max(PromptValidationRule.INTENT_MAXIMUM_LENGTH)
		.describe(
			"A plain-language description of the coding task to compose a prompt for, for example 'add rate limiting to the login endpoint'.",
		),
	remoteName: z
		.string()
		.optional()
		.describe(
			"The git remote to use, needed only when a prior call reported more than one distinct repository among the configured remotes.",
		),
};

export { composePromptInput };
