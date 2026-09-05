class GenerationError extends Error {
	public constructor(message: string, cause?: unknown) {
		super(message, { cause });
	}
}

export { GenerationError };
