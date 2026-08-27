import { UserErrorMessage } from "../../../modules/users/users.js";
import { HTTPCode } from "../../modules/http/http.js";
import { type ValueOf } from "../../types/value-of.type.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class AuthError extends HTTPError {
	public constructor({ cause, message, status }: Constructor) {
		super({ cause, message, status });
	}

	public static createEmailAlreadyExists(): AuthError {
		return new AuthError({
			message: UserErrorMessage.EMAIL_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}

	public static createInvalidCredentials(): AuthError {
		return new AuthError({
			message: UserErrorMessage.INVALID_EMAIL_OR_PASSWORD,
			status: HTTPCode.UNAUTHORIZED,
		});
	}
}

export { AuthError };
