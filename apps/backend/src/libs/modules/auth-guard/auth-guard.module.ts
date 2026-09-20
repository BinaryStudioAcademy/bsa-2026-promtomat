import { API_TOKEN_PREFIX } from "~/libs/constants/constants.js";
import { type UserDto } from "~/libs/types/types.js";

import { BEARER } from "./libs/constants/constants.js";
import { AuthErrorMesssage } from "./libs/enums/enums.js";
import { createUnauthorizedError } from "./libs/helpers/helpers.js";
import { type TokenGuard } from "./libs/types/types.js";

class AuthGuard {
	private readonly apiTokenGuard: TokenGuard;

	private readonly jwtTokenGuard: TokenGuard;

	public constructor(apiTokenGuard: TokenGuard, jwtTokenGuard: TokenGuard) {
		this.apiTokenGuard = apiTokenGuard;
		this.jwtTokenGuard = jwtTokenGuard;
	}

	private extractBearerToken(header?: string): null | string {
		return header?.startsWith(BEARER)
			? header.slice(BEARER.length).trim()
			: null;
	}

	private selectGuard(token: string): TokenGuard {
		return token.startsWith(API_TOKEN_PREFIX)
			? this.apiTokenGuard
			: this.jwtTokenGuard;
	}

	public async resolveUser(authHeader: string | undefined): Promise<UserDto> {
		const token = this.extractBearerToken(authHeader);

		if (!token) {
			throw createUnauthorizedError(AuthErrorMesssage.MISSING_TOKEN);
		}

		const userEntity = await this.selectGuard(token).authenticate(token);

		return userEntity.toObject();
	}
}

export { AuthGuard };
