import { type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import { ErrorCode } from "~/libs/enums/enums.js";
import {
	type ServerCommonErrorResponse,
	type ServerErrorResponse,
	type ServerValidationErrorResponse,
} from "~/libs/types/types.js";

import { type ServerError } from "../types/server-error.type.js";

const UNKNOWN_ERROR_MESSAGE = "Something went wrong. Please try again.";

const checkIsRecord = (value: unknown): value is Record<string, unknown> => {
	return typeof value === "object" && value !== null;
};

const checkIsCommonErrorResponse = (
	value: unknown,
): value is ServerCommonErrorResponse => {
	return (
		checkIsRecord(value) &&
		typeof value["code"] === "string" &&
		(Object.values(ErrorCode) as string[]).includes(value["code"]) &&
		typeof value["message"] === "string"
	);
};

const checkIsValidationErrorResponse = (
	payload: unknown,
): payload is ServerValidationErrorResponse => {
	return (
		checkIsRecord(payload) &&
		"details" in payload &&
		Array.isArray((payload as ServerValidationErrorResponse).details)
	);
};

const checkIsServerErrorResponse = (
	payload: unknown,
): payload is ServerErrorResponse => {
	if (!checkIsCommonErrorResponse(payload)) {
		return false;
	}

	if (payload.code === ErrorCode.VALIDATION_FAILED) {
		return checkIsValidationErrorResponse(payload);
	}

	return true;
};

const toServerError = (error: FetchBaseQueryError): ServerError => {
	if (checkIsServerErrorResponse(error.data)) {
		if (
			error.data.code === ErrorCode.VALIDATION_FAILED &&
			checkIsValidationErrorResponse(error.data)
		) {
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
