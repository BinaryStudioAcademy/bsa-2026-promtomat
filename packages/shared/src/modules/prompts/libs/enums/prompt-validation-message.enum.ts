import { PromptValidationRule } from "./prompt-validation-rule.enum.js";

const PromptValidationMessage = {
	BODY_REQUIRED: "Prompt Body is required",
	BODY_TOO_LONG: `Prompt Body must be at most ${String(PromptValidationRule.BODY_MAXIMUM_LENGTH)} characters`,
	ID_INVALID: "Prompt ID must be a positive integer",
	INTENT_REQUIRED: "Task Intent is required",
	INTENT_TOO_LONG: `Task Intent must be at most ${String(PromptValidationRule.INTENT_MAXIMUM_LENGTH)} characters`,
	INTENT_TOO_SHORT: `Task Intent must be at least ${String(PromptValidationRule.INTENT_MINIMUM_LENGTH)} characters`,
	INVALID_CONTEXT: "Invalid context",
	INVALID_ID: "Invalid prompt id",
} as const;

export { PromptValidationMessage };
