import { type ApiTokenExpirationValue } from "./types.js";

type ApiTokenRequestDto = {
	expiration: ApiTokenExpirationValue;
	name: string;
};

export { ApiTokenRequestDto };
