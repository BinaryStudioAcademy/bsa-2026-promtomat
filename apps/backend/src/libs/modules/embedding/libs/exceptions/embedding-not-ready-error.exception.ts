class EmbeddingNotReadyError extends Error {
	public constructor(message: string, cause?: unknown) {
		super(message, { cause });
		this.name = "EmbeddingNotReadyError";
	}
}

export { EmbeddingNotReadyError };
