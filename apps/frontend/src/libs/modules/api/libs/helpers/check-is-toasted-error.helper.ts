import { ErrorCode } from "~/libs/enums/enums.js";

import { checkIsServerError } from "./check-is-server-error.helper.js";

const checkIsToastedError = (error: unknown): boolean => {
	return (
		checkIsServerError(error) && error.code === ErrorCode.INTERNAL_SERVER_ERROR
	);
};

export { checkIsToastedError };
