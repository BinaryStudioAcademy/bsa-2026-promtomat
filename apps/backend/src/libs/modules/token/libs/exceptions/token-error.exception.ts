class TokenError extends Error {
	public constructor(message: string, cause?: unknown) {
		super(message, { cause });
		this.name = "TokenError";
	}
}

export { TokenError };
