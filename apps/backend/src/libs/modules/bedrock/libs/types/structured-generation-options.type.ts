import { type TextGenerationOptions } from "./text-generation-options.type.js";

type StructuredGenerationOptions = TextGenerationOptions & {
	schema: {
		description?: string;
		name: string;
		value: string;
	};
};

export { type StructuredGenerationOptions };
