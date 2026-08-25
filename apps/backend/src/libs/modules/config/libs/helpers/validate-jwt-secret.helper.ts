const MIN_JWT_SECRET_LENGTH = 32;

const validateJwtSecret = (value: unknown): void => {
	if (
		typeof value !== "string" ||
		value.trim().length < MIN_JWT_SECRET_LENGTH
	) {
		throw new Error(
			`JWT_SECRET must be a string of at least ${String(MIN_JWT_SECRET_LENGTH)} characters.`,
		);
	}
};

export { validateJwtSecret };
