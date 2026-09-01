import { ErrorCode, UserErrorMessage } from "@promptomat/shared";

import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";

class UsersError extends HTTPError {
	public static emailAlreadyExists(): UsersError {
		return new UsersError({
			code: ErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
			message: UserErrorMessage.EMAIL_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}
}

export { UsersError };
