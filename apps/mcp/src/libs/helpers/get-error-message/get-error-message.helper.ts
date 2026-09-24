const getErrorMessage = (error: unknown): string =>
	error instanceof Error ? error.message : String(error);

export { getErrorMessage };
