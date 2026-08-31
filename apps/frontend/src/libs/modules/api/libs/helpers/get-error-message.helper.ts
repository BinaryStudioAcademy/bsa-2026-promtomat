import { ErrorCode } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { ErrorMessage } from "../enums/error-message.enum.js";
import { isServerError } from "./is-server-error.helper.js";

const Messages: Record<ValueOf<typeof ErrorCode>, string> = {
	[ErrorCode.AUTH_EMAIL_ALREADY_EXISTS]: ErrorMessage.EMAIL_ALREADY_EXISTS,
	[ErrorCode.AUTH_INVALID_CREDENTIALS]: ErrorMessage.INVALID_CREDENTIALS,
	[ErrorCode.FORBIDDEN]: ErrorMessage.FORBIDDEN,
	[ErrorCode.INTERNAL_SERVER_ERROR]: ErrorMessage.UNKNOWN,
	[ErrorCode.NETWORK_ERROR]: ErrorMessage.NETWORK,
	[ErrorCode.NOT_FOUND]: ErrorMessage.NOT_FOUND,
	[ErrorCode.UNAUTHENTICATED]: ErrorMessage.SESSION_EXPIRED,
	[ErrorCode.VALIDATION_FAILED]: ErrorMessage.VALIDATION,
};

const getErrorMessage = (error: unknown): string => {
	return isServerError(error) ? Messages[error.code] : ErrorMessage.UNKNOWN;
};

export { getErrorMessage };
