import { AuthErrorCode } from "../../../modules/auth/auth.js";
import { UserErrorMessage } from "../../../modules/users/users.js";
import { HTTPCode } from "../../modules/http/http.js";
import { HTTPError } from "../http-error/http-error.exception.js";

class AuthError extends HTTPError {
	public static emailAlreadyExists(): AuthError {
		return new AuthError({
			code: AuthErrorCode.EMAIL_ALREADY_EXISTS,
			message: UserErrorMessage.EMAIL_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}

	public static invalidCredentials(): AuthError {
		return new AuthError({
			code: AuthErrorCode.INVALID_CREDENTIALS,
			message: UserErrorMessage.INVALID_EMAIL_OR_PASSWORD,
			status: HTTPCode.UNAUTHORIZED,
		});
	}
}

export { AuthError };
