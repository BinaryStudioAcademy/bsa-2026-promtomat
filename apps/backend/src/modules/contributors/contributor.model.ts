import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { UserColumnName } from "../users/libs/enums/enums.js";
import { UserModel } from "../users/user.model.js";
import { WorkspaceColumnName } from "../workspaces/libs/enums/enums.js";
import { WorkspaceModel } from "../workspaces/workspace.model.js";
import { ContributorColumnName } from "./libs/enums/enums.js";

class ContributorModel extends AbstractModel {
	public userId!: number;

	public workspaceId!: number;

	public static get relationMappings(): RelationMappings {
		return {
			user: {
				join: {
					from: `${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.USER_ID}`,
					to: `${DatabaseTableName.USERS}.${UserColumnName.ID}`,
				},
				modelClass: UserModel,
				relation: this.BelongsToOneRelation,
			},
			workspace: {
				join: {
					from: `${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.WORKSPACE_ID}`,
					to: `${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`,
				},
				modelClass: WorkspaceModel,
				relation: this.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.CONTRIBUTORS;
	}
}

export { ContributorModel };
