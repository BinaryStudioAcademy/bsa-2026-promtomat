import { AuthError } from "~/libs/exceptions/exceptions.js";
import { type Hashing } from "~/libs/modules/hashing/hashing.js";
import { type SignUpRequestDto } from "~/modules/auth/libs/types/types.js";
import { UserEntity } from "~/modules/users/user.entity.js";
import { UserRepository } from "~/modules/users/user.repository.js";

import {
	type UserDto,
	type UserGetAllResponseDto,
	type UserUpdateRequestDto,
} from "./libs/types/types.js";

class UserService {
	private hashing: Hashing;

	private userRepository: UserRepository;

	public constructor(hashing: Hashing, userRepository: UserRepository) {
		this.hashing = hashing;
		this.userRepository = userRepository;
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

		const user = await this.userRepository.create(
			UserEntity.initializeNew({
				email: payload.email,
				nickname: payload.nickname,
				passwordHash: hash,
				passwordSalt: salt,
			}),
		);

		return user.toObject();
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

	public async updateProfile(
		userId: number,
		payload: UserUpdateRequestDto,
	): Promise<UserDto> {
		const currentUser = await this.userRepository.findById(userId);

		if (currentUser === null) {
			throw AuthError.invalidCredentials();
		}

		const currentUserObject = currentUser.toObject();

		const isNicknameChanged = payload.nickname !== currentUserObject.nickname;
		const isToolChanged =
			payload.primaryAiCodingTool !== currentUserObject.primaryAiCodingTool;

		if (!isNicknameChanged && !isToolChanged) {
			return currentUserObject;
		}

		if (isNicknameChanged) {
			const existingUser = await this.userRepository.findByNickname(
				payload.nickname,
			);

			if (existingUser && existingUser.toObject().id !== userId) {
				throw AuthError.nicknameAlreadyExists();
			}
		}

		const updatedUser = await this.userRepository.update(userId, payload);

		return updatedUser.toObject();
	}
}

export { UserService };
