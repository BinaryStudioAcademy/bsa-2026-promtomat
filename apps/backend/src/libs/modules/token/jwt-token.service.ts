import { errors, type JWTPayload, jwtVerify, SignJWT } from "jose";

import { type JwtAlgorithm } from "~/libs/modules/config/config.js";
import { type ValueOf } from "~/libs/types/types.js";

import { TokenError } from "./libs/exceptions/exceptions.js";
import {
	type TokenCreateOptions,
	type TokenService,
} from "./libs/types/types.js";

const EMPTY_LENGTH = 0;

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
				throw TokenError.tokenHasExpired(error);
			}

			if (error instanceof errors.JWSSignatureVerificationFailed) {
				throw TokenError.invalidTokenSignature(error);
			}

			throw TokenError.invalidToken(error);
		}
	}

	public async create<T extends Record<string, unknown>>(
		payload: T,
		options?: TokenCreateOptions,
	): Promise<string> {
		const expiresIn = options?.expiresIn ?? this.expiresIn;

		if (expiresIn.trim().length === EMPTY_LENGTH) {
			throw new TypeError("Token expiry must be a non-empty duration string.");
		}

		return await new SignJWT(payload)
			.setProtectedHeader({ alg: this.alg })
			.setIssuedAt()
			.setExpirationTime(expiresIn)
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
