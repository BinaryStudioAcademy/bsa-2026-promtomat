class EmbeddingFailedError extends Error {
	public constructor(message: string, cause?: unknown) {
		super(message, { cause });
		this.name = "EmbeddingFailedError";
	}
}

export { EmbeddingFailedError };
