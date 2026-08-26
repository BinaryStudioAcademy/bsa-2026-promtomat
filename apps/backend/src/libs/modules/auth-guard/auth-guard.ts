import { HTTPCode, HTTPError } from "@promptomat/shared";

import type { UserService } from "~/modules/users/user.service.js";

import type { AuthPayload } from "../server-application/libs/types/types.js";
import type { TokenService } from "../token/libs/types/types.js";

const BEARER = "Bearer ";

class AuthGuard {
	private tokenService: TokenService;

	private userService: UserService;

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
			this.throwUnauthorized("Token is invalid or expired.");
		}
	}

	public async resolveUser(
		authHeader: string | undefined,
	): Promise<AuthPayload> {
		const token = this.extractBearerToken(authHeader);

		if (!token) {
			this.throwUnauthorized("Missing bearer token.");
		}

		const payload = await this.verifyToken(token);

		const user = await this.userService.findById(payload.id);

		if (!user) {
			this.throwUnauthorized("User no longer exists.");
		}

		return payload;
	}
}

export { AuthGuard };
