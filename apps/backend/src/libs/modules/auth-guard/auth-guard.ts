import { HTTPCode, HTTPError, type UserDto } from "@promptomat/shared";

import type { UserService } from "~/modules/users/user.service.js";

import type { TokenService } from "../token/libs/types/types.js";

import { AuthErrorMesssage, BEARER } from "./libs/enums/enums.js";

class AuthGuard {
	private readonly tokenService: TokenService;

	private readonly userService: UserService;

	public constructor(tokenService: TokenService, userService: UserService) {
		this.tokenService = tokenService;
		this.userService = userService;
	}

	private extractBearerToken(header?: string): null | string {
		return header?.startsWith(BEARER)
			? header.slice(BEARER.length).trim()
			: null;
	}

	private throwUnauthorized(message: string): never {
		throw new HTTPError({
			message,
			status: HTTPCode.UNAUTHORIZED,
		});
	}

	private async verifyToken(token: string): Promise<UserDto> {
		try {
			return await this.tokenService.verify<UserDto>(token);
		} catch {
			this.throwUnauthorized(AuthErrorMesssage.INVALID_TOKEN);
		}
	}

	public async resolveUser(authHeader: string | undefined): Promise<UserDto> {
		const token = this.extractBearerToken(authHeader);

		if (!token) {
			this.throwUnauthorized(AuthErrorMesssage.MISSING_TOKEN);
		}

		const payload = await this.verifyToken(token);

		const user = await this.userService.findById(payload.id);

		if (!user) {
			this.throwUnauthorized(AuthErrorMesssage.USER_NOT_FOUND);
		}

		return payload;
	}
}

export { AuthGuard };
