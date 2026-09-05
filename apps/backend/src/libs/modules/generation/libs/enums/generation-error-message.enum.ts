const GenerationErrorMessage = {
	CONFIG_INVALID: "Text generation is not configured correctly.",
	OUTPUT_UNUSABLE: "The model returned unusable output.",
	UNAVAILABLE: "Text generation is temporarily unavailable.",
	UNCLASSIFIED: "Text generation failed for an unrecognized reason.",
	VALIDATION_FAILED: "The text generation request was rejected as invalid.",
} as const;

export { GenerationErrorMessage };
