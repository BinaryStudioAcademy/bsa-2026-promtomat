const validateJwtSecret = (value: unknown): void => {
	if (typeof value !== "string" || value.trim() === "") {
		throw new Error("JWT_SECRET must be a non-empty string.");
	}
};
export { validateJwtSecret };
