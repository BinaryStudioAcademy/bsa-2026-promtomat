import { ErrorCode, HTTPCode } from "~/libs/enums/enums.js";
import {
	ResponseError,
	UnexpectedResponseError,
	UnreachableError,
} from "~/libs/exceptions/exceptions.js";
import { configureString } from "~/libs/helpers/helpers.js";

import {
	ToolErrorHint,
	ToolErrorMessage,
	ToolOutcome,
} from "../enums/enums.js";
import { type ToolFailure } from "../types/types.js";

type Options = {
	apiUrl: string;
	error: unknown;
	toolName: string;
};

const getResponseFailure = (error: ResponseError): ToolFailure => {
	const isTokenRejected =
		error.status === HTTPCode.UNAUTHORIZED &&
		error.code === ErrorCode.UNAUTHENTICATED;

	if (isTokenRejected) {
		return {
			outcome: ToolOutcome.TOKEN_REJECTED,
			text: ToolErrorMessage.TOKEN_REJECTED,
		};
	}

	const text = configureString(ToolErrorMessage.BACKEND_ERROR, {
		code: error.code,
		message: error.message,
		status: String(error.status),
	});

	return {
		outcome: ToolOutcome.BACKEND_ERROR,
		text:
			error.status === HTTPCode.NOT_FOUND
				? `${text} ${ToolErrorHint.API_URL}`
				: text,
	};
};

const getToolFailure = ({ apiUrl, error, toolName }: Options): ToolFailure => {
	if (error instanceof UnreachableError) {
		return {
			outcome: ToolOutcome.UNREACHABLE,
			text: configureString(ToolErrorMessage.UNREACHABLE, {
				cause: error.message,
				url: apiUrl,
			}),
		};
	}

	if (error instanceof UnexpectedResponseError) {
		const text = configureString(ToolErrorMessage.UNEXPECTED_RESPONSE, {
			status: String(error.status),
			url: apiUrl,
		});

		return {
			outcome: ToolOutcome.UNEXPECTED_RESPONSE,
			text: `${text} ${ToolErrorHint.API_URL}`,
		};
	}

	if (error instanceof ResponseError) {
		return getResponseFailure(error);
	}

	return {
		outcome: ToolOutcome.UNEXPECTED,
		text: configureString(ToolErrorMessage.UNEXPECTED, { tool: toolName }),
	};
};

export { getToolFailure };
