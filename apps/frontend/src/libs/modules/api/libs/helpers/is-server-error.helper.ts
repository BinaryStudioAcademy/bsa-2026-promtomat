import { ServerErrorType } from "~/libs/enums/enums.js";

import {
	type ServerError,
	type ServerValidationError,
} from "../types/server-error.type.js";

const isServerError = (error: unknown): error is ServerError => {
	return typeof error === "object" && error !== null && "errorType" in error;
};

const isValidationError = (error: unknown): error is ServerValidationError => {
	return isServerError(error) && error.errorType === ServerErrorType.VALIDATION;
};

export { isServerError, isValidationError };
