import { ErrorCode } from "~/libs/enums/enums.js";

import { type ServerRateLimitError } from "../types/server-error.type.js";
import { checkIsServerError } from "./check-is-server-error.helper.js";

const checkIsRateLimitError = (
	error: unknown,
): error is ServerRateLimitError => {
	return (
		checkIsServerError(error) && error.code === ErrorCode.TOO_MANY_REQUESTS
	);
};

export { checkIsRateLimitError };
