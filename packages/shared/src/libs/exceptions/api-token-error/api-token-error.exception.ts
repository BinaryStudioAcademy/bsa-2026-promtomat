import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import {
	TokenErrorCode,
	TokenErrorMessage,
} from "../../../modules/tokens/tokens.js";
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

	public static nameAlreadyExists(): ApiTokenError {
		return new ApiTokenError({
			code: TokenErrorCode.API_TOKEN_ALREADY_EXISTS,
			message: TokenErrorMessage.API_TOKEN_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}

	public static notFound(): ApiTokenError {
		return new ApiTokenError({
			code: ErrorCode.NOT_FOUND,
			message: TokenErrorMessage.API_TOKEN_NOT_FOUND,
			status: HTTPCode.NOT_FOUND,
		});
	}
}

export { ApiTokenError };
