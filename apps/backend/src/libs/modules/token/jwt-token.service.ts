import { jwtVerify, SignJWT } from "jose";

import { type Config } from "~/libs/modules/config/config.js";

import { type TokenPayload, type TokenService } from "./libs/types/types.js";

class JwtTokenService implements TokenService {
	private expiresIn: string;
	private secret: Uint8Array;

	public constructor(config: Config) {
		this.secret = new TextEncoder().encode(config.ENV.JWT.SECRET);
		this.expiresIn = config.ENV.JWT.EXPIRES_IN;
	}

	public async create(payload: TokenPayload): Promise<string> {
		return await new SignJWT(payload)
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime(this.expiresIn)
			.sign(this.secret);
	}

	public async verify(token: string): Promise<TokenPayload> {
		const { payload } = await jwtVerify(token, this.secret);

		return payload as TokenPayload;
	}
}

export { JwtTokenService };
