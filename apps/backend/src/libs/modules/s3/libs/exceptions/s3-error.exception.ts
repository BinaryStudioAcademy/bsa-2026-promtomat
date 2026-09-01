class S3Error extends Error {
	public constructor(message: string, cause?: unknown) {
		super(message, { cause });
		this.name = "S3Error";
	}
}

export { S3Error };
