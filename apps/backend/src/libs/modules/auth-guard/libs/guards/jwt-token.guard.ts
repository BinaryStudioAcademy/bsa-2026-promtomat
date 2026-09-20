import { MILLISECONDS_IN_SECOND } from "~/libs/constants/constants.js";
import { type UserEntity } from "~/modules/users/user.entity.js";
import { type UserService } from "~/modules/users/user.service.js";

import { type TokenService } from "../../../token/libs/types/types.js";
import { AuthErrorMesssage, AuthSuccessMessage } from "../enums/enums.js";
import { createUnauthorizedError } from "../helpers/helpers.js";
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
			throw createUnauthorizedError(AuthErrorMesssage.INVALID_PAYLOAD);
		}

		const changedAtMilliseconds = new Date(passwordChangedAt).getTime();

		if (Number.isNaN(changedAtMilliseconds)) {
			throw createUnauthorizedError(AuthErrorMesssage.SESSION_NOT_VERIFIABLE);
		}

		const changedAtSeconds = Math.floor(
			changedAtMilliseconds / MILLISECONDS_IN_SECOND,
		);

		if (payload.iat <= changedAtSeconds) {
			throw createUnauthorizedError(AuthSuccessMessage.PASSWORD_CHANGED);
		}
	}

	private async verifyToken(token: string): Promise<AuthPayload> {
		let payload: AuthPayload;

		try {
			payload = await this.tokenService.verify<AuthPayload>(token);
		} catch {
			throw createUnauthorizedError(AuthErrorMesssage.INVALID_TOKEN);
		}

		if (typeof payload.userId !== "number") {
			throw createUnauthorizedError(AuthErrorMesssage.INVALID_PAYLOAD);
		}

		const hasPurpose = Boolean(payload.purpose);

		if (hasPurpose) {
			throw createUnauthorizedError(AuthErrorMesssage.WRONG_PURPOSE);
		}

		return payload;
	}

	public async authenticate(token: string): Promise<UserEntity> {
		const payload = await this.verifyToken(token);

		const userEntity = await this.userService.findEntityById(payload.userId);

		if (!userEntity) {
			throw createUnauthorizedError(AuthErrorMesssage.USER_NOT_FOUND);
		}

		this.assertTokenPredatesNoPasswordChange(
			payload,
			userEntity.toAuthObject().passwordChangedAt,
		);

		return userEntity;
	}
}

export { JwtTokenGuard };
