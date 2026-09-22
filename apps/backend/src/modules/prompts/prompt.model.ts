import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { LabelModel } from "~/modules/labels/label.model.js";
import { LabelColumnName } from "~/modules/labels/libs/enums/enums.js";
import { UserColumnName } from "~/modules/users/libs/enums/enums.js";
import { UserModel } from "~/modules/users/user.model.js";
import { WorkspaceColumnName } from "~/modules/workspaces/libs/enums/enums.js";
import { WorkspaceModel } from "~/modules/workspaces/workspace.model.js";

import { PromptColumnName } from "./libs/enums/enums.js";

class PromptModel extends AbstractModel {
	public computedScore!: null | number;

	public efficiencyScore!: number;

	public labelId!: null | number;

	public promptBody!: string;

	public taskIntent!: string;

	public userId!: number;

	public workspace!: WorkspaceModel;

	public workspaceId!: number;

	public static override get relationMappings(): RelationMappings {
		return {
			label: {
				join: {
					from: `${DatabaseTableName.PROMPTS}.${PromptColumnName.LABEL_ID}`,
					to: `${DatabaseTableName.LABELS}.${LabelColumnName.ID}`,
				},
				modelClass: LabelModel,
				relation: this.BelongsToOneRelation,
			},
			user: {
				join: {
					from: `${DatabaseTableName.PROMPTS}.${PromptColumnName.USER_ID}`,
					to: `${DatabaseTableName.USERS}.${UserColumnName.ID}`,
				},
				modelClass: UserModel,
				relation: this.BelongsToOneRelation,
			},
			workspace: {
				join: {
					from: `${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
					to: `${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`,
				},
				modelClass: WorkspaceModel,
				relation: this.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.PROMPTS;
	}
}

export { PromptModel };
