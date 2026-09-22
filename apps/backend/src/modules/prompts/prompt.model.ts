import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { LabelModel } from "~/modules/labels/label.model.js";
import { PromptColumnName } from "~/modules/prompts/libs/enums/enums.js";
import { UserModel } from "~/modules/users/user.model.js";
import { WorkspaceModel } from "~/modules/workspaces/workspace.model.js";

class PromptModel extends AbstractModel {
	public computedScore!: null | number;

	public efficiencyScore!: number;

	public labelId!: null | number;

	public promptBody!: string;

	public taskIntent!: string;

	public userId!: number;

	public workspaceId!: number;

	public static override get relationMappings(): RelationMappings {
		return {
			label: {
				join: {
					from: `${DatabaseTableName.PROMPTS}.${PromptColumnName.LABEL_ID}`,
					to: `${DatabaseTableName.LABELS}.id`,
				},
				modelClass: LabelModel,
				relation: this.BelongsToOneRelation,
			},
			user: {
				join: {
					from: `${DatabaseTableName.PROMPTS}.${PromptColumnName.USER_ID}`,
					to: `${DatabaseTableName.USERS}.id`,
				},
				modelClass: UserModel,
				relation: this.BelongsToOneRelation,
			},
			workspace: {
				join: {
					from: `${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
					to: `${DatabaseTableName.WORKSPACES}.id`,
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
