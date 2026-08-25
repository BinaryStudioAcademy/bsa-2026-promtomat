import { HTTPCode, HTTPError } from "@promptomat/shared";

import type { UserService } from "~/modules/users/user.service.js";

//TODO: import token with verify method AFTER merging issue #23

const BEARER = "Bearer ";

//TODO: delete following declaration and import AuthPayload type AFTER merging issue #9/#7
type AuthPayload = {
	id: number;
};
//TODO: import type Token AFTER merging issue #23
type Token = {
	verify: <T>(token: string) => Promise<T>;
};

class AuthGuard {
	private token: Token;

	private userService: UserService;

	public constructor(token: Token, userService: UserService) {
		this.token = token;
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
			return await this.token.verify<AuthPayload>(token);
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
