class S3Error extends Error {
	public key: string | undefined;

	public constructor(message: string, key?: string, cause?: unknown) {
		super(message, { cause });
		this.key = key;
		this.name = "S3Error";
	}
}

export { S3Error };
