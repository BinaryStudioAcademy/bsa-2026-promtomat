import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class PasswordResetModel extends AbstractModel {
	public expiresAt!: Date;

	public tokenHash!: string;

	public userId!: number;

	public static override get tableName(): string {
		return DatabaseTableName.PASSWORD_RESET_TOKENS;
	}
}

export { PasswordResetModel };
