import { type Transaction } from "objection";

import { UserEntity } from "~/modules/users/user.entity.js";
import { type UserModel } from "~/modules/users/user.model.js";

class UserRepository {
	private userModel: typeof UserModel;

	public constructor(userModel: typeof UserModel) {
		this.userModel = userModel;
	}

	public async create(
		entity: UserEntity,
		trx?: Transaction,
	): Promise<UserEntity> {
		const { email, passwordHash, passwordSalt } = entity.toNewObject();

		const user = await this.userModel
			.query(trx)
			.insert({
				email,
				passwordHash,
				passwordSalt,
			})
			.returning("*")
			.execute();

		return UserEntity.initialize(user);
	}

	public async findAll(): Promise<UserEntity[]> {
		const users = await this.userModel.query().execute();

		return users.map((user) => UserEntity.initialize(user));
	}

	public async findByEmail(email: string): Promise<null | UserEntity> {
		const user = await this.userModel.query().findOne({ email }).execute();

		return user ? UserEntity.initialize(user) : null;
	}

	public async findById(id: number): Promise<null | UserEntity> {
		const user = await this.userModel.query().findById(id);

		return user ? UserEntity.initialize(user) : null;
	}
}

export { UserRepository };
