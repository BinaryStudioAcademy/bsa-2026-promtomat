import { PromptValidationRule } from "../../../prompts/libs/enums/prompt-validation-rule.enum.js";

const ComposedPromptValidationMessage = {
	DESCRIPTION_TOO_LONG: `Description must be at most ${String(PromptValidationRule.INTENT_MAXIMUM_LENGTH)} characters`,
	DESCRIPTION_TOO_SHORT: `Description must be at least ${String(PromptValidationRule.INTENT_MINIMUM_LENGTH)} characters`,
	INVALID_ID: "Invalid composed prompt id",
	INVALID_WORKSPACE: "Invalid workspace",
} as const;

export { ComposedPromptValidationMessage };
