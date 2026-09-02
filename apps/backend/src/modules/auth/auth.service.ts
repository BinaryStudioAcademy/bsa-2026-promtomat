import { AuthError } from "~/libs/exceptions/exceptions.js";
import { Hashing } from "~/libs/modules/hashing/hashing.js";
import { type TokenService } from "~/libs/modules/token/token.js";
import { type UserService } from "~/modules/users/user.service.js";
import { WorkspaceVisibility } from "~/modules/workspaces/libs/enums/enums.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { UserModel } from "../users/user.model.js";
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

	private workspaceService: WorkspaceService;

	public constructor({
		hashing,
		tokenService,
		userService,
		workspaceService,
	}: {
		hashing: Hashing;
		tokenService: TokenService;
		userService: UserService;
		workspaceService: WorkspaceService;
	}) {
		this.hashing = hashing;
		this.tokenService = tokenService;
		this.userService = userService;
		this.workspaceService = workspaceService;
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
		const user = await UserModel.transaction(async (trx) => {
			const newUser = await this.userService.create(signUpRequestDto, trx);

			await this.workspaceService.create(
				{
					name: `${newUser.email} workspace`,
					stackTags: [],
					visibility: WorkspaceVisibility.PRIVATE,
				},
				newUser.id,
				trx,
			);

			return newUser;
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
