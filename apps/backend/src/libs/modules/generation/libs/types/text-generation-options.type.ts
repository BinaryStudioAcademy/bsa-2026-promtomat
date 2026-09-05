type ModelConfig = {
	maxTokens?: number;
	stopSequences?: string[];
	temperature?: number;
	topP?: number;
};

type TextGenerationOptions = {
	config?: ModelConfig;
	message: string;
	systemPrompt?: string;
};

export { type TextGenerationOptions };
