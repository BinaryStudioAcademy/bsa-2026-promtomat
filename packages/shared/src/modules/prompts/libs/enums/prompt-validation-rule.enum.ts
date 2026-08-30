const PromptValidationRule = {
	BODY_MINIMUM_LENGTH: 1,
	EFFICIENCY_SCORE_MAX: 10,
	EFFICIENCY_SCORE_MIN: 1,
	INTENT_MINIMUM_LENGTH: 1,
} as const;

export { PromptValidationRule };
