import { ErrorCode } from "~/libs/enums/enums.js";

import { type ServerRateLimitError } from "../types/server-error.type.js";
import { isServerError } from "./is-server-error.helper.js";

const isRateLimitError = (error: unknown): error is ServerRateLimitError => {
	return isServerError(error) && error.code === ErrorCode.TOO_MANY_REQUESTS;
};

export { isRateLimitError };
