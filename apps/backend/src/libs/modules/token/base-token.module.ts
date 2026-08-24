import { jwtVerify, SignJWT } from "jose";

import { type Config } from "~/libs/modules/config/config.js";

import { type Token } from "./libs/types/types.js";

class BaseToken implements Token {
	private expiresIn: string;
	private secret: Uint8Array;

	public constructor(config: Config) {
		this.expiresIn = config.ENV.JWT.EXPIRES_IN;
		this.secret = new TextEncoder().encode(config.ENV.JWT.SECRET);
	}

	public async create<T extends Record<string, unknown>>(
		payload: T,
	): Promise<string> {
		return await new SignJWT(payload)
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime(this.expiresIn)
			.sign(this.secret);
	}

	public async verify<T>(token: string): Promise<T> {
		const { payload } = await jwtVerify(token, this.secret);

		return payload as T;
	}
}

export { BaseToken };
