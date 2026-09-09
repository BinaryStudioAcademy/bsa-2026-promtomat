import { type ErrorDetails } from "~/libs/types/types.js";

const getErrorDetails = (error: unknown): ErrorDetails => ({
	message: error instanceof Error ? error.message : String(error),
	stack: error instanceof Error ? error.stack : undefined,
});

export { getErrorDetails };
