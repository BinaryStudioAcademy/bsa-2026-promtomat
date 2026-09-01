import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";

import { AiCodingTool } from "./libs/enums/enums.js";

class UserModel extends AbstractModel {
	public email!: string;

	public nickname!: string;

	public passwordHash!: string;

	public passwordSalt!: string;

	public primaryAiCodingTool!: ValueOf<typeof AiCodingTool>;

	public static override get tableName(): string {
		return DatabaseTableName.USERS;
	}
}

export { UserModel };
