import { PromptValidationRule } from "./prompt-validation-rule.enum.js";

const PromptValidationMessage = {
	BODY_REQUIRED: "Prompt body is required",
	BODY_TOO_LONG: `Task intent must be at most ${String(PromptValidationRule.BODY_MAXIMUM_LENGTH)}`,
	INTENT_REQUIRED: "Task intent is required",
	INTENT_TOO_LONG: `Task Intent must be at most ${String(PromptValidationRule.INTENT_MAXIMUM_LENGTH)} characters`,
	INTENT_TOO_SHORT: `Task Intent must be at least ${String(PromptValidationRule.INTENT_MINIMUM_LENGTH)} characters`,
} as const;

export { PromptValidationMessage };
