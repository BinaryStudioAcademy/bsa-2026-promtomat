import { errors, jwtVerify, SignJWT } from "jose";

import { TokenErrorMessage } from "./libs/enums/enums.js";
import { TokenError } from "./libs/exceptions/exceptions.js";
import { type TokenPayload, type TokenService } from "./libs/types/types.js";

type Constructor = {
	alg: string;
	expiresIn: string;
	secret: Uint8Array;
};

class JwtTokenService implements TokenService {
	private alg: string;
	private expiresIn: string;
	private secret: Uint8Array;

	public constructor({ alg, expiresIn, secret }: Constructor) {
		this.alg = alg;
		this.expiresIn = expiresIn;
		this.secret = secret;
	}

	public async create(payload: TokenPayload): Promise<string> {
		return await new SignJWT(payload)
			.setProtectedHeader({ alg: this.alg })
			.setExpirationTime(this.expiresIn)
			.sign(this.secret);
	}

	public async verify(token: string): Promise<TokenPayload> {
		try {
			const { payload } = await jwtVerify(token, this.secret);

			return payload as TokenPayload;
		} catch (error) {
			if (error instanceof errors.JWTExpired) {
				throw new TokenError(TokenErrorMessage.TOKEN_HAS_EXPIRED, error);
			}

			if (error instanceof errors.JWSSignatureVerificationFailed) {
				throw new TokenError(TokenErrorMessage.INVALID_TOKEN_SIGNATURE, error);
			}

			throw new TokenError(TokenErrorMessage.INVALID_TOKEN, error);
		}
	}
}

export { JwtTokenService };
