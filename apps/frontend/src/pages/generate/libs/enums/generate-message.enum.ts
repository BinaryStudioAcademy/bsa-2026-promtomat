const GenerateMessage = {
	FALLBACK_HINT: "Here is the closest stored prompt instead.",
	FALLBACK_NOTHING_SAVED:
		"This is an existing prompt from the log. Nothing new was saved",
	GENERATION_FAILED: "Generation failed",
	NO_MATCHES: "Nothing close enough in this workspace to compose from.",
	RATE_HINT:
		"Rate it to save it to your log and make it available to future generations",
} as const;

export { GenerateMessage };
