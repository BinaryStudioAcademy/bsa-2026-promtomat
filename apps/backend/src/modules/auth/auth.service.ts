import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type TokenService } from "~/libs/modules/token/token.js";
import { type UserDto } from "~/modules/users/libs/types/types.js";
import { type UserService } from "~/modules/users/user.service.js";

import { ExceptionMessage } from "./libs/enums/enums.js";
import {
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";

class AuthService {
	private tokenService: TokenService;
	private userService: UserService;

	public constructor(userService: UserService, tokenService: TokenService) {
		this.tokenService = tokenService;
		this.userService = userService;
	}

	public async getAuthenticatedUser(id: number): Promise<UserDto> {
		const user = await this.userService.findById(id);

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

		const token = await this.tokenService.create({
			userId: user.id,
		});

		return {
			token,
			user,
		};
	}
}

export { AuthService };
