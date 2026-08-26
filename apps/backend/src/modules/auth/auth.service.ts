import { AuthError } from "~/libs/exceptions/exceptions.js";
import { Hashing } from "~/libs/modules/hashing/hashing.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type TokenService } from "~/libs/modules/token/token.js";
import { type UserService } from "~/modules/users/user.service.js";

import { UserErrorMessage } from "../users/libs/enums/enums.js";
import {
	type SignInRequestDto,
	type SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";

class AuthService {
	private hashing: Hashing;

	private tokenService: TokenService;

	private userService: UserService;

	public constructor(
		hashing: Hashing,
		tokenService: TokenService,
		userService: UserService,
	) {
		this.hashing = hashing;
		this.tokenService = tokenService;
		this.userService = userService;
	}

	public async signIn(
		userRequestDto: SignInRequestDto,
	): Promise<SignInResponseDto> {
		const userEntity = await this.userService.findByEmail(userRequestDto.email);

		if (!userEntity) {
			await this.hashing.hash(userRequestDto.password);
			throw new AuthError({
				message: UserErrorMessage.INVALID_EMAIL_OR_PASSWORD,
				status: HTTPCode.UNAUTHORIZED,
			});
		}

		const userAuth = userEntity.toAuthObject();
		const isValidPassword = await this.hashing.verify({
			data: userRequestDto.password,
			hash: userAuth.passwordHash,
			salt: userAuth.passwordSalt,
		});

		if (!isValidPassword) {
			throw new AuthError({
				message: UserErrorMessage.INVALID_EMAIL_OR_PASSWORD,
				status: HTTPCode.UNAUTHORIZED,
			});
		}

		const user = userEntity.toObject();

		const token = await this.tokenService.create({
			userId: user.id,
		});

		return {
			token,
			user,
		};
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
