import { type TokenCreateOptions } from "./token-create-options.type.js";

type TokenService = {
	create<T extends Record<string, unknown>>(
		payload: T,
		options?: TokenCreateOptions,
	): Promise<string>;
	verify<T extends Record<string, unknown>>(token: string): Promise<T>;
};

export { type TokenService };
