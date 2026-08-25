import { type TokenService } from "~/libs/modules/token/token.js";
import { type UserService } from "~/modules/users/user.service.js";

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

	public async signUp(
		signUpRequestDto: SignUpRequestDto,
	): Promise<SignUpResponseDto> {
		const user = await this.userService.create(signUpRequestDto);

		const token = await this.tokenService.create({
			id: user.id,
		});

		return {
			token,
			user,
		};
	}
}

export { AuthService };