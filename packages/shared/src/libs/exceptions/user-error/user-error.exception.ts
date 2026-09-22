import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import {
	UserErrorMessage,
	UsersErrorCode,
} from "../../../modules/users/users.js";
import { ErrorCode } from "../../enums/error-code.enum.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof ErrorCode>;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class UserError extends HTTPError {
	public constructor({ cause, code, message, status }: Constructor) {
		super({
			cause,
			code,
			message,
			status,
		});
	}

	public static notFound(): UserError {
		return new UserError({
			code: UsersErrorCode.USER_NOT_FOUND,
			message: UserErrorMessage.USER_NOT_FOUND,
			status: HTTPCode.NOT_FOUND,
		});
	}
}

export { UserError };
