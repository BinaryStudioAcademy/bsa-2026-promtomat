import { checkIsServerError } from "./check-is-server-error.helper.js";

const getErrorMessage = (
	error: unknown,
	fallback: null | string = null,
): null | string => {
	return checkIsServerError(error) ? error.message : fallback;
};

export { getErrorMessage };
