import { ErrorCode } from "~/libs/enums/enums.js";

import { type ServerValidationError } from "../types/server-error.type.js";
import { checkIsServerError } from "./check-is-server-error.helper.js";

const checkIsValidationError = (
	error: unknown,
): error is ServerValidationError => {
	return (
		checkIsServerError(error) && error.code === ErrorCode.VALIDATION_FAILED
	);
};

export { checkIsValidationError };
