import { isServerError } from "./is-server-error.helper.js";

const getErrorMessage = (
	error: unknown,
	fallback: null | string = null,
): null | string => {
	return isServerError(error) ? error.message : fallback;
};

export { getErrorMessage };
