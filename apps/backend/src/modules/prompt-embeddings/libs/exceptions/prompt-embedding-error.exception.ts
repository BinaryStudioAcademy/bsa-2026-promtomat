class PromptEmbeddingError extends Error {
	public constructor(message: string, cause?: unknown) {
		super(message, { cause });
		this.name = "PromptEmbeddingError";
	}
}

export { PromptEmbeddingError };
