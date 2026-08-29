import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import { AuthValidationMessage } from "../../../modules/auth/libs/enums/auth-validation-message.enum.js";
import { UserErrorMessage } from "../../../modules/users/users.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class AuthError extends HTTPError {
	public constructor({ cause, message, status }: Constructor) {
		super({
			cause,
			message,
			status,
		});

		this.status = status;
	}

	public static emailAlreadyExists(): AuthError {
		return new AuthError({
			message: UserErrorMessage.EMAIL_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}

	public static invalidCredentials(): AuthError {
		return new AuthError({
			message: UserErrorMessage.INVALID_EMAIL_OR_PASSWORD,
			status: HTTPCode.UNAUTHORIZED,
		});
	}

	public static nicknameAlreadyTaken(): AuthError {
		return new AuthError({
			message: AuthValidationMessage.NICKNAME_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}
}

export { AuthError };
