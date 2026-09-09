import { type StructuredOutputSchema } from "./structured-output-schema.type.js";

type CommandOptions = {
	config?: ModelConfig;
	message: string;
	schema?: StructuredOutputSchema;
	systemPrompt?: string;
};

type ModelConfig = {
	maxTokens?: number;
	stopSequences?: string[];
	temperature?: number;
	topP?: number;
};

export { type CommandOptions };
