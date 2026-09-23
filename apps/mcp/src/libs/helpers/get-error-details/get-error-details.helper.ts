import { type ErrorDetails } from "~/libs/types/types.js";

import { getErrorMessage } from "../get-error-message/get-error-message.helper.js";

const getErrorDetails = (error: unknown): ErrorDetails => {
	const isError = error instanceof Error;

	return {
		cause:
			isError && error.cause !== undefined
				? getErrorMessage(error.cause)
				: undefined,
		message: getErrorMessage(error),
		stack: isError ? error.stack : undefined,
	};
};

export { getErrorDetails };
