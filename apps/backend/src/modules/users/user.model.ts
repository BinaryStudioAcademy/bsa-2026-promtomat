import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { type PrimaryAiCodingTool } from "./libs/types/types.js";

class UserModel extends AbstractModel {
	public email!: string;

	public nickname!: string;

	public passwordChangedAt!: null | string;

	public passwordHash!: string;

	public passwordSalt!: string;

	public primaryAiCodingTool!: null | PrimaryAiCodingTool;

	public static override get tableName(): string {
		return DatabaseTableName.USERS;
	}
}

export { UserModel };
