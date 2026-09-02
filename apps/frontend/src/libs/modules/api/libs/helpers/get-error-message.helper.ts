import { ErrorCode } from "@promptomat/shared";

import { isServerError } from "./is-server-error.helper.js";

const getErrorMessage = (
	error: unknown,
	fallback: null | string = null,
): null | string => {
	return isServerError(error) && error.code !== ErrorCode.INTERNAL_SERVER_ERROR
		? error.message
		: fallback;
};

export { getErrorMessage };
