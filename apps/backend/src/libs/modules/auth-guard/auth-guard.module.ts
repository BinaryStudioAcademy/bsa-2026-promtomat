import {
	API_TOKEN_PREFIX,
	MILLISECONDS_IN_SECOND,
} from "~/libs/constants/constants.js";
import { ErrorCode } from "~/libs/enums/enums.js";
import { AuthError } from "~/libs/exceptions/exceptions.js";
import { type UserDto } from "~/libs/types/types.js";
import { type ApiTokenService } from "~/modules/api-tokens/api-tokens.js";
import { type UserService } from "~/modules/users/user.service.js";

import { HTTPCode } from "../http/http.js";
import { type TokenService } from "../token/libs/types/types.js";
import { BEARER } from "./libs/constants/constants.js";
import { AuthErrorMesssage, AuthSuccessMessage } from "./libs/enums/enums.js";
import { isAuthPayload } from "./libs/helpers/helpers.js";
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

	private assertTokenPredatesNoPasswordChange(
		payload: AuthPayload,
		passwordChangedAt: null | string,
	): void {
		if (!passwordChangedAt) {
			return;
		}

		if (!payload.iat) {
			this.throwUnauthorized(AuthErrorMesssage.INVALID_PAYLOAD);
		}

		const changedAtMilliseconds = new Date(passwordChangedAt).getTime();

		if (Number.isNaN(changedAtMilliseconds)) {
			this.throwUnauthorized(AuthErrorMesssage.SESSION_NOT_VERIFIABLE);
		}

		const changedAtSeconds = Math.floor(
			changedAtMilliseconds / MILLISECONDS_IN_SECOND,
		);

		if (payload.iat <= changedAtSeconds) {
			this.throwUnauthorized(AuthSuccessMessage.PASSWORD_CHANGED);
		}
	}

	private extractBearerToken(header?: string): null | string {
		return header?.startsWith(BEARER)
			? header.slice(BEARER.length).trim()
			: null;
	}

	private async resolveUserId(token: string): Promise<Partial<AuthPayload>> {
		if (token.startsWith(API_TOKEN_PREFIX)) {
			const userId = await this.apiTokenService.verify(token);
			if (!userId) {
				this.throwUnauthorized(AuthErrorMesssage.INVALID_TOKEN);
			}

			return {
				userId,
			};
		}

		const payload = await this.verifyToken(token);

		return payload;
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

		const hasPurpose = Boolean(payload.purpose);

		if (hasPurpose) {
			this.throwUnauthorized(AuthErrorMesssage.WRONG_PURPOSE);
		}

		return payload;
	}

	public async resolveUser(authHeader: string | undefined): Promise<UserDto> {
		const token = this.extractBearerToken(authHeader);

		if (!token) {
			this.throwUnauthorized(AuthErrorMesssage.MISSING_TOKEN);
		}

		const { userId, ...payload } = await this.resolveUserId(token);

		if (!userId) {
			this.throwUnauthorized(AuthErrorMesssage.INVALID_TOKEN);
		}

		const userEntity = await this.userService.findEntityById(userId);

		if (!userEntity) {
			this.throwUnauthorized(AuthErrorMesssage.USER_NOT_FOUND);
		}

		if (isAuthPayload(payload)) {
			this.assertTokenPredatesNoPasswordChange(
				payload,
				userEntity.toAuthObject().passwordChangedAt,
			);
		}

		return userEntity.toObject();
	}
}

export { AuthGuard };
