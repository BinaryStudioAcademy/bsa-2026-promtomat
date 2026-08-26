import { HTTPCode, HTTPError } from "@promptomat/shared";

import type { UserService } from "~/modules/users/user.service.js";

import type { AuthPayload } from "../server-application/libs/types/types.js";
import type { TokenService } from "../token/libs/types/types.js";

const BEARER = "Bearer ";
const AUTH_ERROR_MESSAGES = {
	INVALID_TOKEN: "Token is invalid or expired.",
	MISSING_TOKEN: "Missing bearer token.",
	USER_NOT_FOUND: "User no longer exists.",
} as const;

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

	private async verifyToken(token: string): Promise<AuthPayload> {
		try {
			return await this.tokenService.verify<AuthPayload>(token);
		} catch {
			this.throwUnauthorized(AUTH_ERROR_MESSAGES.INVALID_TOKEN);
		}
	}

	public async resolveUser(
		authHeader: string | undefined,
	): Promise<AuthPayload> {
		const token = this.extractBearerToken(authHeader);

		if (!token) {
			this.throwUnauthorized(AUTH_ERROR_MESSAGES.MISSING_TOKEN);
		}

		const payload = await this.verifyToken(token);

		const user = await this.userService.findById(payload.userId);

		if (!user) {
			this.throwUnauthorized(AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
		}

		return payload;
	}
}

export { AuthGuard };
