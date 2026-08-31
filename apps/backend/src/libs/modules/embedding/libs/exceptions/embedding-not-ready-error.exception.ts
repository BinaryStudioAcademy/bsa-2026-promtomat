class EmbeddingNotReadyError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = "EmbeddingNotReadyError";
	}
}

export { EmbeddingNotReadyError };
