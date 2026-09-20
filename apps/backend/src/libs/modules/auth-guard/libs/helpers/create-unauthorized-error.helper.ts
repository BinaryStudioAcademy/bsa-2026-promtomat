import { ErrorCode } from "~/libs/enums/enums.js";
import { AuthError } from "~/libs/exceptions/exceptions.js";

import { HTTPCode } from "../../../http/http.js";

const createUnauthorizedError = (message: string): AuthError => {
	return new AuthError({
		code: ErrorCode.UNAUTHENTICATED,
		message,
		status: HTTPCode.UNAUTHORIZED,
	});
};

export { createUnauthorizedError };
