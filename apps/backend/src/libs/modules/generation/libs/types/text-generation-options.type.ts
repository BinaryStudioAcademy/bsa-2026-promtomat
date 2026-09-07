type TextGenerationOptions = {
	config?: {
		maxTokens?: number;
		stopSequences?: string[];
		temperature?: number;
		topP?: number;
	};
	message: string;
	systemPrompt?: string;
};

export { type TextGenerationOptions };
