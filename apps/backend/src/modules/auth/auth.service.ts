import { AuthError } from "~/libs/exceptions/exceptions.js";
import { Database } from "~/libs/modules/database/database.js";
import { Hashing } from "~/libs/modules/hashing/hashing.js";
import { type TokenService } from "~/libs/modules/token/token.js";
import { type UserService } from "~/modules/users/user.service.js";

import {
	type SignInRequestDto,
	type SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";

class AuthService {
	private database: Database;

	private hashing: Hashing;

	private tokenService: TokenService;

	private userService: UserService;

	public constructor({
		database,
		hashing,
		tokenService,
		userService,
	}: {
		database: Database;
		hashing: Hashing;
		tokenService: TokenService;
		userService: UserService;
	}) {
		this.database = database;
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
			throw AuthError.invalidCredentials();
		}

		const userAuth = userEntity.toAuthObject();
		const isValidPassword = await this.hashing.verify({
			data: userRequestDto.password,
			hash: userAuth.passwordHash,
			salt: userAuth.passwordSalt,
		});

		if (!isValidPassword) {
			throw AuthError.invalidCredentials();
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
		const user = await this.database.transaction(async (trx) => {
			return await this.userService.create(signUpRequestDto, trx);
		});

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
