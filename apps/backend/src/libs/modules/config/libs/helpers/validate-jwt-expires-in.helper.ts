const validateJwtExpiresIn = (value: unknown): void => {
	if (typeof value !== "string" || !/^\d+[smhdwy]$/.test(value)) {
		throw new Error(
			"JWT_EXPIRES_IN must be a valid duration string (e.g., '24h').",
		);
	}
};
export { validateJwtExpiresIn };
