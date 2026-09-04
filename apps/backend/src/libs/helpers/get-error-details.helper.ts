const getErrorDetails = (
	error: unknown,
): { message: string; stack: string | undefined } => ({
	message: error instanceof Error ? error.message : String(error),
	stack: error instanceof Error ? error.stack : undefined,
});

export { getErrorDetails };
