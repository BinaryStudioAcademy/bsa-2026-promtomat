import { ErrorCode } from "../../../libs/enums/enums.js";
import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import { UserErrorMessage } from "../../../modules/users/users.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof ErrorCode>;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class AuthError extends HTTPError {
	public constructor({ cause, code, message, status }: Constructor) {
		super({
			cause,
			code,
			message,
			status,
		});

		this.status = status;
	}

	public static emailAlreadyExists(): AuthError {
		return new AuthError({
			code: ErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
			message: UserErrorMessage.EMAIL_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}

	public static invalidCredentials(): AuthError {
		return new AuthError({
			code: ErrorCode.AUTH_INVALID_CREDENTIALS,
			message: UserErrorMessage.INVALID_EMAIL_OR_PASSWORD,
			status: HTTPCode.UNAUTHORIZED,
		});
	}
}

export { AuthError };
