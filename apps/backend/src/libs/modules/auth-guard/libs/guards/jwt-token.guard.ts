import { AuthErrorMessage, TimeUnit } from "~/libs/enums/enums.js";
import { AuthError } from "~/libs/exceptions/exceptions.js";
import { type UserEntity } from "~/modules/users/user.entity.js";
import { type UserService } from "~/modules/users/user.service.js";

import { type TokenService } from "../../../token/libs/types/types.js";
import { AuthSuccessMessage } from "../enums/enums.js";
import { type AuthPayload, type TokenGuard } from "../types/types.js";

class JwtTokenGuard implements TokenGuard {
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
			throw AuthError.unauthorized(AuthErrorMessage.INVALID_PAYLOAD);
		}

		const changedAtMilliseconds = new Date(passwordChangedAt).getTime();

		if (Number.isNaN(changedAtMilliseconds)) {
			throw AuthError.unauthorized(AuthErrorMessage.SESSION_NOT_VERIFIABLE);
		}

		const changedAtSeconds = Math.floor(
			changedAtMilliseconds / TimeUnit.MILLISECONDS_PER_SECOND,
		);

		if (payload.iat <= changedAtSeconds) {
			throw AuthError.unauthorized(AuthSuccessMessage.PASSWORD_CHANGED);
		}
	}

	private async verifyToken(token: string): Promise<AuthPayload> {
		let payload: AuthPayload;

		try {
			payload = await this.tokenService.verify<AuthPayload>(token);
		} catch {
			throw AuthError.unauthorized(AuthErrorMessage.INVALID_TOKEN);
		}

		if (typeof payload.userId !== "number") {
			throw AuthError.unauthorized(AuthErrorMessage.INVALID_PAYLOAD);
		}

		const hasPurpose = Boolean(payload.purpose);

		if (hasPurpose) {
			throw AuthError.unauthorized(AuthErrorMessage.WRONG_PURPOSE);
		}

		return payload;
	}

	public async authenticate(token: string): Promise<UserEntity> {
		const payload = await this.verifyToken(token);

		const userEntity = await this.userService.findEntityById(payload.userId);

		if (!userEntity) {
			throw AuthError.unauthorized(AuthErrorMessage.USER_NOT_FOUND);
		}

		this.assertTokenPredatesNoPasswordChange(
			payload,
			userEntity.toAuthObject().passwordChangedAt,
		);

		return userEntity;
	}
}

export { JwtTokenGuard };
