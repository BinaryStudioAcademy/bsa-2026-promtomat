import { type ApiTokenService } from "~/modules/api-tokens/api-tokens.js";
import { type UserEntity } from "~/modules/users/user.entity.js";
import { type UserService } from "~/modules/users/user.service.js";

import { AuthErrorMesssage } from "../enums/enums.js";
import { createUnauthorizedError } from "../helpers/helpers.js";
import { type TokenGuard } from "../types/types.js";

class ApiTokenGuard implements TokenGuard {
	private readonly apiTokenService: ApiTokenService;

	private readonly userService: UserService;

	public constructor(
		apiTokenService: ApiTokenService,
		userService: UserService,
	) {
		this.apiTokenService = apiTokenService;
		this.userService = userService;
	}

	public async authenticate(token: string): Promise<UserEntity> {
		const userId = await this.apiTokenService.verify(token);

		if (!userId) {
			throw createUnauthorizedError(AuthErrorMesssage.INVALID_TOKEN);
		}

		const userEntity = await this.userService.findEntityById(userId);

		if (!userEntity) {
			throw createUnauthorizedError(AuthErrorMesssage.USER_NOT_FOUND);
		}

		return userEntity;
	}
}

export { ApiTokenGuard };
