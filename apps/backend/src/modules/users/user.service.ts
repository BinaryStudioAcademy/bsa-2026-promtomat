import { AuthError } from "~/libs/exceptions/exceptions.js";
import { type Database } from "~/libs/modules/database/database.js";
import { type Hashing } from "~/libs/modules/hashing/hashing.js";
import { type SignUpRequestDto } from "~/modules/auth/libs/types/types.js";
import { UserEntity } from "~/modules/users/user.entity.js";
import { UserRepository } from "~/modules/users/user.repository.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import {
	type UserDto,
	type UserGetAllResponseDto,
} from "./libs/types/types.js";

class UserService {
	private database: Database;

	private hashing: Hashing;

	private userRepository: UserRepository;

	private workspaceService: WorkspaceService;

	public constructor({
		database,
		hashing,
		userRepository,
		workspaceService,
	}: {
		database: Database;
		hashing: Hashing;
		userRepository: UserRepository;
		workspaceService: WorkspaceService;
	}) {
		this.database = database;
		this.hashing = hashing;
		this.userRepository = userRepository;
		this.workspaceService = workspaceService;
	}

	public async create(payload: SignUpRequestDto): Promise<UserDto> {
		const existingUser = await this.userRepository.findByEmailOrNickname(
			payload.email,
			payload.nickname,
		);

		if (existingUser) {
			if (existingUser.toNewObject().email === payload.email) {
				throw AuthError.emailAlreadyExists();
			}
			throw AuthError.nicknameAlreadyExists();
		}

		const { hash, salt } = await this.hashing.hash(payload.password);

		return await this.database.transaction(async (trx) => {
			const user = await this.userRepository.create(
				UserEntity.initializeNew({
					email: payload.email,
					nickname: payload.nickname,
					passwordHash: hash,
					passwordSalt: salt,
				}),
				trx,
			);

			const userDto = user.toObject();

			await this.workspaceService.create(
				{
					name: `${userDto.nickname} workspace`,
					userId: userDto.id,
				},
				trx,
			);

			return userDto;
		});
	}

	public async findAll(): Promise<UserGetAllResponseDto> {
		const users = await this.userRepository.findAll();

		return {
			items: users.map((user) => user.toObject()),
		};
	}

	public async findByEmail(email: string): Promise<null | UserEntity> {
		return await this.userRepository.findByEmail(email);
	}

	public async findById(id: number): Promise<null | UserDto> {
		const user = await this.userRepository.findById(id);

		return user ? user.toObject() : null;
	}

	public async findByNickname(nickname: string): Promise<null | UserDto> {
		const user = await this.userRepository.findByNickname(nickname);

		return user ? user.toObject() : null;
	}
}

export { UserService };
