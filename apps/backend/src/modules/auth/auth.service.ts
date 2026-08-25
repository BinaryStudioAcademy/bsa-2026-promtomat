import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { PasswordHasher } from "~/libs/modules/password-hasher/password-hasher.js";
import { type UserService } from "~/modules/users/user.service.js";

import { UserErrorMessage } from "../users/libs/enums/enums.js";
import {
	type SignInRequestDto,
	type SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";

const DUMMY_HASH =
	"8a1c481148b859b836b49fd577ba54c29fb16dbf44a48bc462d60f5e2709fe6a4cbe36f8e01d0b02fb63a77dced76e53a6771365bffc4b441fa4a4a51cb6023b";
const DUMMY_SALT = "0f5cf02c0465b914d3036158f58dce4e";

// TODO: replace with a token issued by the token module — pm-23
const TOKEN_PLACEHOLDER = "token-placeholder";

class AuthService {
	private passwordHasher: PasswordHasher;

	private userService: UserService;

	public constructor(passwordHasher: PasswordHasher, userService: UserService) {
		this.userService = userService;
		this.passwordHasher = passwordHasher;
	}

	public async signIn(
		userRequesDto: SignInRequestDto,
	): Promise<SignInResponseDto> {
		const userEntity = await this.userService.findByEmail(userRequesDto.email);

		let isValidPassword = false;

		if (userEntity) {
			const userAuth = userEntity.toAuthObject();

			isValidPassword = await this.passwordHasher.verify({
				hash: userAuth.passwordHash,
				password: userRequesDto.password,
				salt: userAuth.passwordSalt,
			});
		} else {
			// dummy hash to waste the same CPU time
			await this.passwordHasher.verify({
				hash: DUMMY_HASH,
				password: userRequesDto.password,
				salt: DUMMY_SALT,
			});
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
