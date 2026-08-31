import { type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import { ErrorCode } from "~/libs/enums/enums.js";
import {
	type ServerErrorResponse,
	type ServerValidationErrorResponse,
} from "~/libs/types/types.js";

import { type ServerError } from "../types/server-error.type.js";

const NO_HTTP_STATUS = 0;

const isServerErrorResponse = (
	payload: unknown,
): payload is ServerErrorResponse => {
	if (
		typeof payload !== "object" ||
		payload === null ||
		!("code" in payload) ||
		!("message" in payload) ||
		typeof (payload as { message: unknown }).message !== "string"
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

const toHttpStatus = (error: FetchBaseQueryError): number => {
	if (typeof error.status === "number") {
		return error.status;
	}

	if (error.status === "PARSING_ERROR") {
		return error.originalStatus;
	}

	return NO_HTTP_STATUS;
};

const toServerError = (error: FetchBaseQueryError): ServerError => {
	if (error.status === "FETCH_ERROR" || error.status === "TIMEOUT_ERROR") {
		return { code: ErrorCode.NETWORK_ERROR, status: NO_HTTP_STATUS };
	}

	const status = toHttpStatus(error);

	if (isServerErrorResponse(error.data)) {
		const { data } = error;

		if (isValidationErrorResponse(data)) {
			return {
				code: ErrorCode.VALIDATION_FAILED,
				details: data.details,
				status,
			};
		}

		const { code } = data;

		if (code !== ErrorCode.VALIDATION_FAILED) {
			return { code, status };
		}
	}

	return { code: ErrorCode.INTERNAL_SERVER_ERROR, status };
};

export { toServerError };
