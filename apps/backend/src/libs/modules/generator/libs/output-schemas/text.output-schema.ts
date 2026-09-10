const textOutputSchema = {
	description: "Text generation schema",
	name: "text_answer",
	value: JSON.stringify({
		additionalProperties: false,
		properties: { text: { type: "string" } },
		required: ["text"],
		type: "object",
	}),
} as const;

export { textOutputSchema };
