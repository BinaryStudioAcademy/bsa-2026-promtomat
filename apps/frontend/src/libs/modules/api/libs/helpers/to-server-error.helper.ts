import { type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import { ServerErrorType } from "~/libs/enums/enums.js";
import { type ServerErrorResponse } from "~/libs/types/types.js";

import { type ServerError } from "../types/server-error.type.js";

const UNKNOWN_ERROR_MESSAGE = "Something went wrong. Please try again.";

const isServerErrorResponse = (
	payload: unknown,
): payload is ServerErrorResponse => {
	if (
		typeof payload !== "object" ||
		payload === null ||
		!("errorType" in payload) ||
		!("message" in payload)
	) {
		return false;
	}

	// A validation response without a well-formed `details` array is treated as
	// a common error, so the narrowed type never lies about `details`.
	if (payload.errorType === ServerErrorType.VALIDATION) {
		return "details" in payload && Array.isArray(payload.details);
	}

	return payload.errorType === ServerErrorType.COMMON;
};

const toServerError = (error: FetchBaseQueryError): ServerError => {
	if (isServerErrorResponse(error.data)) {
		const { data } = error;

		if (data.errorType === ServerErrorType.VALIDATION) {
			return {
				details: data.details,
				errorType: ServerErrorType.VALIDATION,
				message: data.message,
				status: error.status,
			};
		}

		return {
			code: data.code,
			errorType: ServerErrorType.COMMON,
			message: data.message,
			status: error.status,
		};
	}

	return {
		errorType: ServerErrorType.COMMON,
		message: "error" in error ? error.error : UNKNOWN_ERROR_MESSAGE,
		status: error.status,
	};
};

export { toServerError };
