import { type Token } from "~/libs/modules/token/token.js";
import {
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/libs/types/types.js";
import { type UserService } from "~/modules/users/user.service.js";

class AuthService {
	private tokenService: Token;
	private userService: UserService;

	public constructor(userService: UserService, tokenService: Token) {
		this.tokenService = tokenService;
		this.userService = userService;
	}

	public async signUp(
		userRequestDto: UserSignUpRequestDto,
	): Promise<UserSignUpResponseDto> {
		const user = await this.userService.create(userRequestDto);
		const token = await this.tokenService.create({ id: user.id });

		return {
			...user,
			token,
		};
	}
}

export { AuthService };
