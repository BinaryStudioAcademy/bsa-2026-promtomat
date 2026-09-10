import { type Transaction } from "objection";

import { PasswordResetEntity } from "./password-reset.entity.js";
import { type PasswordResetModel } from "./password-reset.model.js";

const NO_DELETED_ROWS = 0;

class PasswordResetRepository {
	private passwordResetModel: typeof PasswordResetModel;

	public constructor(passwordResetModel: typeof PasswordResetModel) {
		this.passwordResetModel = passwordResetModel;
	}

	public async create(
		entity: PasswordResetEntity,
	): Promise<PasswordResetEntity> {
		const token = await this.passwordResetModel
			.query()
			.insert(entity.toNewObject())
			.onConflict("userId")
			.merge(["expiresAt", "tokenHash", "updatedAt"])
			.returning("*")
			.execute();

		return PasswordResetEntity.initialize(token);
	}

	public async delete(id: number, trx?: Transaction): Promise<boolean> {
		const deletedRows = await this.passwordResetModel
			.query(trx)
			.deleteById(id)
			.execute();

		return deletedRows !== NO_DELETED_ROWS;
	}

	public async findByTokenHash(
		tokenHash: string,
	): Promise<null | PasswordResetEntity> {
		const token = await this.passwordResetModel
			.query()
			.findOne({ tokenHash })
			.execute();

		return token ? PasswordResetEntity.initialize(token) : null;
	}
}

export { PasswordResetRepository };
