const checkIsNonEmptyString = (value: unknown): value is string =>
	typeof value === "string" && value.trim() !== "";

export { checkIsNonEmptyString };
