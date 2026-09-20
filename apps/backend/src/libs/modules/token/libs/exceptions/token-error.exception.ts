import { TokenErrorCode } from "~/libs/enums/enums.js";
import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type ValueOf } from "~/libs/types/types.js";

import { TokenErrorMessage } from "../enums/enums.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof TokenErrorCode>;
	message: ValueOf<typeof TokenErrorMessage>;
};

class TokenError extends HTTPError {
	public constructor({ cause, code, message }: Constructor) {
		super({
			cause,
			code,
			message,
			status: HTTPCode.UNAUTHORIZED,
		});
	}

	public static invalidToken(cause?: unknown): TokenError {
		return new TokenError({
			cause,
			code: TokenErrorCode.INVALID_TOKEN,
			message: TokenErrorMessage.INVALID_TOKEN,
		});
	}

	public static invalidTokenPayload(cause?: unknown): TokenError {
		return new TokenError({
			cause,
			code: TokenErrorCode.INVALID_TOKEN_PAYLOAD,
			message: TokenErrorMessage.INVALID_TOKEN_PAYLOAD,
		});
	}

	public static invalidTokenSignature(cause?: unknown): TokenError {
		return new TokenError({
			cause,
			code: TokenErrorCode.INVALID_TOKEN_SIGNATURE,
			message: TokenErrorMessage.INVALID_TOKEN_SIGNATURE,
		});
	}

	public static tokenHasExpired(cause?: unknown): TokenError {
		return new TokenError({
			cause,
			code: TokenErrorCode.TOKEN_HAS_EXPIRED,
			message: TokenErrorMessage.TOKEN_HAS_EXPIRED,
		});
	}
}

export { TokenError };
