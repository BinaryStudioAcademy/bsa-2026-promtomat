import { ErrorCode } from "~/libs/enums/enums.js";

import { isServerError } from "./is-server-error.helper.js";

const checkIsToastedError = (error: unknown): boolean => {
	return isServerError(error) && error.code === ErrorCode.INTERNAL_SERVER_ERROR;
};

export { checkIsToastedError };
