class EmbeddingFailedError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = "EmbeddingFailedError";
	}
}

export { EmbeddingFailedError };
