const composedPromptOutputSchema = {
	description:
		"One prompt composed from numbered source prompts, with an explanation and the source numbers used",
	name: "composed_prompt",
	value: JSON.stringify({
		additionalProperties: false,
		properties: {
			explanation: {
				description:
					"Plain prose in English, saying what was taken from which source by its number",
				type: "string",
			},
			prompt: {
				description: "The composed prompt in markdown, written in English",
				type: "string",
			},
			usedSources: { items: { type: "integer" }, type: "array" },
		},
		required: ["prompt", "explanation", "usedSources"],
		type: "object",
	}),
} as const;

export { composedPromptOutputSchema };
