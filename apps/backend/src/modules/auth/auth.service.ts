import { Hashing } from "~/libs/modules/hashing/hashing.js";
import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type UserService } from "~/modules/users/user.service.js";

import { UserErrorMessage } from "../users/libs/enums/enums.js";
import {
	type SignInRequestDto,
	type SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";

// TODO: replace with a token issued by the token module — pm-23
const TOKEN_PLACEHOLDER = "token-placeholder";

class AuthService {
	private hashing: Hashing;

	private userService: UserService;

	public constructor(hashing: Hashing, userService: UserService) {
		this.userService = userService;
		this.hashing = hashing;
	}

	public async signIn(
		userRequestDto: SignInRequestDto,
	): Promise<SignInResponseDto> {
		const userEntity = await this.userService.findByEmail(userRequestDto.email);

		let isValidPassword = false;

		if (userEntity) {
			const userAuth = userEntity.toAuthObject();

			isValidPassword = await this.hashing.verify({
				data: userRequestDto.password,
				hash: userAuth.passwordHash,
				salt: userAuth.passwordSalt,
			});
		} else {
			await this.hashing.hash(userRequestDto.password);
		}

		if (!userEntity || !isValidPassword) {
			throw new HTTPError({
				message: UserErrorMessage.INVALID_EMAIL_OR_PASSWORD,
				status: HTTPCode.UNAUTHORIZED,
			});
		}

		return { token: TOKEN_PLACEHOLDER, user: userEntity.toObject() };
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
