import {
	NotFoundError,
	type Transaction,
	UniqueViolationError,
} from "objection";

import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { AuthError } from "~/libs/exceptions/exceptions.js";
import { UserEntity } from "~/modules/users/user.entity.js";
import { type UserModel } from "~/modules/users/user.model.js";

import {
	NO_UPDATED_ROWS,
	STREAK_ON_PROMPT_LOG_QUERY,
	STREAK_READ_QUERY,
	STREAK_RECOMPUTE_QUERY,
} from "./libs/constants/constants.js";
import {
	type ResetPasswordPayload,
	type UserStreak,
	type UserUpdateRequestDto,
} from "./libs/types/types.js";

const UsersConstraintName = {
	NICKNAME_UNIQUE: "users_nickname_unique",
} as const;

class UserRepository {
	private userModel: typeof UserModel;

	public constructor(userModel: typeof UserModel) {
		this.userModel = userModel;
	}

	public async create(
		entity: UserEntity,
		trx?: Transaction,
	): Promise<UserEntity> {
		const user = await this.userModel
			.query(trx)
			.insert(entity.toNewObject())
			.returning("*")
			.execute();
		return UserEntity.initialize(user);
	}

	public async findByEmail(email: string): Promise<null | UserEntity> {
		const user = await this.userModel.query().findOne({ email }).execute();

		if (!user) {
			return null;
		}

		return UserEntity.initialize(user);
	}

	public async findByEmailOrNickname(
		email: string,
		nickname: string,
	): Promise<null | UserEntity> {
		const user = await this.userModel
			.query()
			.where({ email })
			.orWhere({ nickname })
			.first()
			.execute();

		if (!user) {
			return null;
		}

		return UserEntity.initialize(user);
	}

	public async findById(id: number): Promise<null | UserEntity> {
		const user = await this.userModel.query().findById(id);

		return user ? UserEntity.initialize(user) : null;
	}

	public async findByNickname(nickname: string): Promise<null | UserEntity> {
		const user = await this.userModel.query().findOne({ nickname }).execute();

		if (!user) {
			return null;
		}

		return UserEntity.initialize(user);
	}

	public async findStreakByUserId(userId: number): Promise<null | UserStreak> {
		const result = await this.userModel
			.knex()
			.raw<{ rows: UserStreak[] }>(STREAK_READ_QUERY, [userId]);

		const [row] = result.rows;

		if (!row) {
			return null;
		}

		return row;
	}

	public async update(
		id: number,
		payload: UserUpdateRequestDto,
	): Promise<UserEntity> {
		try {
			const user = await this.userModel
				.query()
				.patchAndFetchById(id, payload)
				.throwIfNotFound();

			return UserEntity.initialize(user);
		} catch (error) {
			if (
				error instanceof UniqueViolationError &&
				error.constraint === UsersConstraintName.NICKNAME_UNIQUE
			) {
				throw AuthError.nicknameAlreadyExists();
			}

			if (error instanceof NotFoundError) {
				throw AuthError.userNotFound();
			}

			throw error;
		}
	}

	public async updatePasswordIfUnchangedSince(
		id: number,
		payload: ResetPasswordPayload,
		trx?: Transaction,
	): Promise<boolean> {
		const { issuedAt, ...columns } = payload;

		const updatedRows = await this.userModel
			.query(trx)
			.patch(columns)
			.where("id", id)
			.where((builder) => {
				void builder
					.whereNull("passwordChangedAt")
					.orWhere("passwordChangedAt", "<", issuedAt);
			});

		return updatedRows !== NO_UPDATED_ROWS;
	}
	public async updateStreakForTimeZone(
		userId: number,
		timeZone: string,
	): Promise<number> {
		const result = await this.userModel
			.knex()
			.raw<{ rows: { currentStreak: number }[] }>(STREAK_RECOMPUTE_QUERY, {
				timeZone,
				userId,
			});

		const [row] = result.rows;

		if (!row) {
			return ZERO_VALUE;
		}

		const { currentStreak } = row;

		return currentStreak;
	}

	public async updateStreakOnPromptLog(
		userId: number,
		trx?: Transaction,
	): Promise<void> {
		const queryRunner = trx ?? this.userModel.knex();

		await queryRunner.raw(STREAK_ON_PROMPT_LOG_QUERY, [userId]);
	}
}

export { UserRepository };
