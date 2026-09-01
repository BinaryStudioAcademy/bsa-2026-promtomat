import { type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import { ErrorCode } from "~/libs/enums/enums.js";
import {
	type ServerErrorResponse,
	ServerValidationErrorResponse,
} from "~/libs/types/types.js";

import { type ServerError } from "../types/server-error.type.js";

const UNKNOWN_ERROR_MESSAGE = "Something went wrong. Please try again.";

const isServerErrorResponse = (
	payload: unknown,
): payload is ServerErrorResponse => {
	if (
		typeof payload !== "object" ||
		payload === null ||
		!("code" in payload) ||
		!("message" in payload)
	) {
		return false;
	}

	if ((payload as ServerErrorResponse).code === ErrorCode.VALIDATION_FAILED) {
		return (
			"details" in payload &&
			Array.isArray((payload as ServerValidationErrorResponse).details)
		);
	}

	return true;
};

const isValidationErrorResponse = (
	response: ServerErrorResponse,
): response is ServerValidationErrorResponse => {
	return response.code === ErrorCode.VALIDATION_FAILED;
};

const toServerError = (error: FetchBaseQueryError): ServerError => {
	if (isServerErrorResponse(error.data)) {
		if (isValidationErrorResponse(error.data)) {
			return {
				code: ErrorCode.VALIDATION_FAILED,
				details: error.data.details,
				message: error.data.message,
				status: error.status,
			};
		}

		return {
			code: error.data.code,
			message: error.data.message,
			status: error.status,
		};
	}

	return {
		code: ErrorCode.INTERNAL_SERVER_ERROR,
		message:
			"error" in error && typeof error.error === "string"
				? error.error
				: UNKNOWN_ERROR_MESSAGE,
		status: error.status,
	};
};

export { toServerError };
