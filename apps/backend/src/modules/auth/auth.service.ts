import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import {
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/libs/types/types.js";
import { type UserService } from "~/modules/users/user.service.js";

import { ExceptionMessage } from "./libs/enums/enums.js";

class AuthService {
	private userService: UserService;

	public constructor(userService: UserService) {
		this.userService = userService;
	}

	public async getAuthenticatedUser(
		id: number,
	): Promise<UserSignUpResponseDto> {
		const user = await this.userService.find(id);

		if (user === null) {
			throw new HTTPError({
				message: ExceptionMessage.UNAUTHORIZED,
				status: HTTPCode.UNAUTHORIZED,
			});
		}

		return user;
	}

	public signUp(
		userRequestDto: UserSignUpRequestDto,
	): Promise<UserSignUpResponseDto> {
		return this.userService.create(userRequestDto);
	}
}

export { AuthService };
