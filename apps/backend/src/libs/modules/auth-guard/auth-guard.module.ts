import { API_TOKEN_PREFIX } from "~/libs/constants/constants.js";
import { ErrorCode } from "~/libs/enums/enums.js";
import { AuthError } from "~/libs/exceptions/exceptions.js";
import { type UserDto } from "~/libs/types/types.js";
import { type ApiTokenService } from "~/modules/api-tokens/api-tokens.js";
import { type UserService } from "~/modules/users/user.service.js";

import { HTTPCode } from "../http/http.js";
import { type TokenService } from "../token/libs/types/types.js";
import { BEARER } from "./libs/constants/constants.js";
import { AuthErrorMesssage } from "./libs/enums/enums.js";
import { type AuthPayload } from "./libs/types/types.js";

class AuthGuard {
	private readonly apiTokenService: ApiTokenService;

	private readonly tokenService: TokenService;

	private readonly userService: UserService;

	public constructor(
		tokenService: TokenService,
		userService: UserService,
		apiTokenService: ApiTokenService,
	) {
		this.tokenService = tokenService;
		this.userService = userService;
		this.apiTokenService = apiTokenService;
	}

	private extractBearerToken(header?: string): null | string {
		return header?.startsWith(BEARER)
			? header.slice(BEARER.length).trim()
			: null;
	}

	private async resolveUserId(token: string): Promise<null | number> {
		if (token.startsWith(API_TOKEN_PREFIX)) {
			return await this.apiTokenService.verify(token);
		}

		const payload = await this.verifyToken(token);

		return payload.userId;
	}

	private throwUnauthorized(message: string): never {
		throw new AuthError({
			code: ErrorCode.UNAUTHENTICATED,
			message,
			status: HTTPCode.UNAUTHORIZED,
		});
	}

	private async verifyToken(token: string): Promise<AuthPayload> {
		let payload: AuthPayload;
		try {
			payload = await this.tokenService.verify<AuthPayload>(token);
		} catch {
			this.throwUnauthorized(AuthErrorMesssage.INVALID_TOKEN);
		}

		if (typeof payload.userId !== "number") {
			this.throwUnauthorized(AuthErrorMesssage.INVALID_PAYLOAD);
		}

		return payload;
	}

	public async resolveUser(authHeader: string | undefined): Promise<UserDto> {
		const token = this.extractBearerToken(authHeader);

		if (!token) {
			this.throwUnauthorized(AuthErrorMesssage.MISSING_TOKEN);
		}

		const userId = await this.resolveUserId(token);

		if (userId === null) {
			this.throwUnauthorized(AuthErrorMesssage.INVALID_TOKEN);
		}

		const user = await this.userService.findById(userId);

		if (!user) {
			this.throwUnauthorized(AuthErrorMesssage.USER_NOT_FOUND);
		}

		return user;
	}
}

export { AuthGuard };
