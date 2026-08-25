import { errors, type JWTPayload, jwtVerify, SignJWT } from "jose";

import { type JwtAlgorithm } from "~/libs/modules/config/config.js";
import { type ValueOf } from "~/libs/types/types.js";

import { TokenErrorMessage } from "./libs/enums/enums.js";
import { TokenError } from "./libs/exceptions/exceptions.js";
import { type TokenService } from "./libs/types/types.js";

type Constructor = {
	alg: ValueOf<typeof JwtAlgorithm>;
	expiresIn: string;
	secret: Uint8Array;
};

class JwtTokenService implements TokenService {
	private alg: ValueOf<typeof JwtAlgorithm>;
	private expiresIn: string;
	private secret: Uint8Array;

	public constructor({ alg, expiresIn, secret }: Constructor) {
		this.alg = alg;
		this.expiresIn = expiresIn;
		this.secret = secret;
	}

	private async decode(token: string): Promise<JWTPayload> {
		try {
			const { payload } = await jwtVerify(token, this.secret, {
				algorithms: [this.alg],
			});

			return payload;
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

	public async create<T extends Record<string, unknown>>(
		payload: T,
	): Promise<string> {
		return await new SignJWT(payload)
			.setProtectedHeader({ alg: this.alg })
			.setIssuedAt()
			.setExpirationTime(this.expiresIn)
			.sign(this.secret);
	}

	public async verify<T extends Record<string, unknown>>(
		token: string,
	): Promise<T> {
		const payload = await this.decode(token);

		return payload as T;
	}
}

export { JwtTokenService };
