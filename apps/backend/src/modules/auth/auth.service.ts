import { type UserService } from "~/modules/users/user.service.js";

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
