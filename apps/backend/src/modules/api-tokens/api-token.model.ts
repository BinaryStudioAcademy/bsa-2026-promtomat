import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { UserModel } from "../users/user.model.js";

class ApiTokenModel extends AbstractModel {
	public expiresAt!: string;

	public lastUsedAt!: null | string;

	public name!: string;

	public publicId!: string;

	public tokenHash!: string;

	public userId!: number;

	public static get relationMappings(): RelationMappings {
		return {
			user: {
				join: {
					from: `${DatabaseTableName.API_TOKENS}.user_id`,
					to: `${DatabaseTableName.USERS}.id`,
				},
				modelClass: UserModel,
				relation: this.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.API_TOKENS;
	}
}

export { ApiTokenModel };
