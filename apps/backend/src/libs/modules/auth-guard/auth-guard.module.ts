import { BEARER, MILLISECONDS_IN_SECOND } from "~/libs/constants/constants.js";
import { AuthErrorMessage, ErrorCode } from "~/libs/enums/enums.js";
import { AuthError } from "~/libs/exceptions/exceptions.js";
import { type UserDto } from "~/libs/types/types.js";
import { type UserService } from "~/modules/users/user.service.js";

import { HTTPCode } from "../http/http.js";
import { type TokenService } from "../token/libs/types/types.js";
import { AuthSuccessMessage } from "./libs/enums/enums.js";
import { type AuthPayload } from "./libs/types/types.js";

class AuthGuard {
	private readonly tokenService: TokenService;

	private readonly userService: UserService;

	public constructor(tokenService: TokenService, userService: UserService) {
		this.tokenService = tokenService;
		this.userService = userService;
	}

	private assertTokenPredatesNoPasswordChange(
		payload: AuthPayload,
		passwordChangedAt: null | string,
	): void {
		if (!passwordChangedAt) {
			return;
		}

		if (!payload.iat) {
			this.throwUnauthorized(AuthErrorMessage.INVALID_PAYLOAD);
		}

		const changedAtMilliseconds = new Date(passwordChangedAt).getTime();

		if (Number.isNaN(changedAtMilliseconds)) {
			this.throwUnauthorized(AuthErrorMessage.SESSION_NOT_VERIFIABLE);
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
			this.throwUnauthorized(AuthErrorMessage.INVALID_TOKEN);
		}

		if (typeof payload.userId !== "number") {
			this.throwUnauthorized(AuthErrorMessage.INVALID_PAYLOAD);
		}

		const hasPurpose = Boolean(payload.purpose);

		if (hasPurpose) {
			this.throwUnauthorized(AuthErrorMessage.WRONG_PURPOSE);
		}

		return payload;
	}

	public async resolveUser(authHeader: string | undefined): Promise<UserDto> {
		const token = this.extractBearerToken(authHeader);

		if (!token) {
			this.throwUnauthorized(AuthErrorMessage.MISSING_TOKEN);
		}

		const payload = await this.verifyToken(token);

		const userEntity = await this.userService.findEntityById(payload.userId);

		if (!userEntity) {
			this.throwUnauthorized(AuthErrorMessage.USER_NOT_FOUND);
		}

		this.assertTokenPredatesNoPasswordChange(
			payload,
			userEntity.toAuthObject().passwordChangedAt,
		);

		return userEntity.toObject();
	}
}

export { AuthGuard };
