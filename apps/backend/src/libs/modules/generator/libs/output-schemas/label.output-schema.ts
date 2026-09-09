const labelOutputSchema = {
	description: "Label generation schema",
	name: "lable_answer",
	value: JSON.stringify({
		additionalProperties: false,
		properties: { label: { type: "string" } },
		required: ["text"],
		type: "object",
	}),
} as const;

export { labelOutputSchema };
