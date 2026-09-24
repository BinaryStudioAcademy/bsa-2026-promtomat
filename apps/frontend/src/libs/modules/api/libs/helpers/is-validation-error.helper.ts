import { ErrorCode } from "~/libs/enums/enums.js";

import { type ServerValidationError } from "../types/server-error.type.js";
import { isServerError } from "./is-server-error.helper.js";

const isValidationError = (error: unknown): error is ServerValidationError => {
	return isServerError(error) && error.code === ErrorCode.VALIDATION_FAILED;
};

export { isValidationError };
