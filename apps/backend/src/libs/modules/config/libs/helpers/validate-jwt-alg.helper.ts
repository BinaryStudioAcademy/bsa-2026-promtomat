const validateJwtAlg = (value: unknown): void => {
	if (typeof value !== "string" || value.trim() === "") {
		throw new Error("JWT_ALG must be a non-empty string.");
	}
};
export { validateJwtAlg };
