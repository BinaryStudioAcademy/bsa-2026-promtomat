const MIN_JWT_SECRET_BYTES = 64;

const validateJwtSecret = (value: unknown): void => {
	if (typeof value !== "string") {
		throw new TypeError("JWT_SECRET must be a string.");
	}

	const byteLength = new TextEncoder().encode(value).length;

	if (byteLength < MIN_JWT_SECRET_BYTES) {
		throw new Error(
			`JWT_SECRET must be at least ${String(MIN_JWT_SECRET_BYTES)} bytes long.`,
		);
	}
};

export { validateJwtSecret };
