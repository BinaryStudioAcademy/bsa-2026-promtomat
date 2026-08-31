import { type Hashing } from "~/libs/modules/hashing/hashing.js";
import { type SignUpRequestDto } from "~/modules/auth/libs/types/types.js";
import { UserEntity } from "~/modules/users/user.entity.js";
import { type UserRepository } from "~/modules/users/user.repository.js";

import { UsersError } from "./libs/exceptions/exceptions.js";
import {
	type UserDto,
	type UserGetAllResponseDto,
} from "./libs/types/types.js";

class UserService {
	private hashing: Hashing;

	private userRepository: UserRepository;

	public constructor(hashing: Hashing, userRepository: UserRepository) {
		this.hashing = hashing;
		this.userRepository = userRepository;
	}

	public async create(payload: SignUpRequestDto): Promise<UserDto> {
		const existingUser = await this.userRepository.findByEmail(payload.email);

		if (existingUser) {
			throw UsersError.emailAlreadyExists();
		}

		const { hash, salt } = await this.hashing.hash(payload.password);

		const user = await this.userRepository.create(
			UserEntity.initializeNew({
				email: payload.email,
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
}

export { UserService };
