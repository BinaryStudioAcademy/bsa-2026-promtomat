import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type UserDto } from "~/modules/users/libs/types/types.js";
import { type UserService } from "~/modules/users/user.service.js";

import { ExceptionMessage } from "./libs/enums/enums.js";
import {
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";

// TODO: replace with a token issued by the token module — pm-23
const TOKEN_PLACEHOLDER = "token-placeholder";

class AuthService {
	private userService: UserService;

	public constructor(userService: UserService) {
		this.userService = userService;
	}

	public async getAuthenticatedUser(id: number): Promise<UserDto> {
		const user = await this.userService.find(id);

		if (user === null) {
			throw new HTTPError({
				message: ExceptionMessage.UNAUTHORIZED,
				status: HTTPCode.UNAUTHORIZED,
			});
		}

		return user;
	}

	public async signUp(
		signUpRequestDto: SignUpRequestDto,
	): Promise<SignUpResponseDto> {
		const user = await this.userService.create(signUpRequestDto);

		return {
			token: TOKEN_PLACEHOLDER,
			user,
		};
	}
}

export { AuthService };
