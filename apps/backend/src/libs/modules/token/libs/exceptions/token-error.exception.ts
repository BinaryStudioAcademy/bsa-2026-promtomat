import { ErrorCode } from "~/libs/enums/enums.js";
import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type ValueOf } from "~/libs/types/types.js";

import { TokenErrorMessage } from "../enums/enums.js";

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

	public static invalidToken(): TokenError {
		return new TokenError({
			message: TokenErrorMessage.INVALID_TOKEN,
		});
	}

	public static invalidTokenPayload(): TokenError {
		return new TokenError({
			message: TokenErrorMessage.INVALID_TOKEN_PAYLOAD,
		});
	}

	public static invalidTokenSignature(): TokenError {
		return new TokenError({
			message: TokenErrorMessage.INVALID_TOKEN_SIGNATURE,
		});
	}

	public static tokenHasExpired(): TokenError {
		return new TokenError({
			message: TokenErrorMessage.TOKEN_HAS_EXPIRED,
		});
	}
}

export { TokenError };
