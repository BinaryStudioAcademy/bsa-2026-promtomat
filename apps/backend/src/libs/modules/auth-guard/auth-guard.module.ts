import { type UserService } from "~/modules/users/user.service.js";

import { HTTPCode } from "../http/http.js";
import { type TokenService } from "../token/libs/types/types.js";
import { AuthErrorMesssage, BEARER } from "./libs/enums/enums.js";
import { AuthError } from "./libs/exceptions/exceptions.js";
import { type AuthPayload, type UserDto } from "./libs/types/types.js";

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
		throw new AuthError({
			message,
			status: HTTPCode.UNAUTHORIZED,
		});
	}

	private async verifyToken(token: string): Promise<AuthPayload> {
		try {
			const payload = await this.tokenService.verify<AuthPayload>(token);

			if (typeof payload.userId !== "number") {
				this.throwUnauthorized(AuthErrorMesssage.INVALID_PAYLOAD);
			}

			return payload;
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

		const user = await this.userService.findById(payload.userId);

		if (!user) {
			this.throwUnauthorized(AuthErrorMesssage.USER_NOT_FOUND);
		}

		return user;
	}
}

export { AuthGuard };
