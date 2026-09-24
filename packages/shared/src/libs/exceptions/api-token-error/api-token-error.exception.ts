import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import {
	ApiTokenErrorCode,
	ApiTokenErrorMessage,
} from "../../../modules/api-tokens/api-tokens.js";
import { ErrorCode } from "../../enums/error-code.enum.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof ErrorCode>;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class ApiTokenError extends HTTPError {
	public constructor({ cause, code, message, status }: Constructor) {
		super({
			cause,
			code,
			message,
			status,
		});
	}

	public static failedToParse(): ApiTokenError {
		return new ApiTokenError({
			code: ErrorCode.API_TOKEN_FAILED_TO_PARSE,
			message: ApiTokenErrorMessage.API_TOKEN_FAILED_TO_PARSE,
			status: HTTPCode.UNPROCESSED_ENTITY,
		});
	}

	public static nameAlreadyExists(): ApiTokenError {
		return new ApiTokenError({
			code: ApiTokenErrorCode.API_TOKEN_ALREADY_EXISTS,
			message: ApiTokenErrorMessage.API_TOKEN_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}

	public static notFound(): ApiTokenError {
		return new ApiTokenError({
			code: ErrorCode.NOT_FOUND,
			message: ApiTokenErrorMessage.API_TOKEN_NOT_FOUND,
			status: HTTPCode.NOT_FOUND,
		});
	}
}

export { ApiTokenError };
