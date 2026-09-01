import { ErrorCode } from "@promptomat/shared";

import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type TokenErrorMessage } from "../enums/enums.js";

type Constructor = {
	cause?: unknown;
	message: ValueOf<typeof TokenErrorMessage>;
};

class TokenError extends HTTPError {
	public constructor({ cause, message }: Constructor) {
		super({
			cause,
			code: ErrorCode.UNAUTHENTICATED,
			message,
			status: HTTPCode.UNAUTHORIZED,
		});
	}
}

export { TokenError };
