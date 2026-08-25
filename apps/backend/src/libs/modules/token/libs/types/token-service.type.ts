import { type TokenPayload } from "./token-payload.type.js";

type TokenService = {
	create(payload: TokenPayload): Promise<string>;
	verify(token: string): Promise<TokenPayload>;
};

export { type TokenService };
