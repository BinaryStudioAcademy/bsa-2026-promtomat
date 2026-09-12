import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";

import { PromptColumnName } from "../prompts/libs/enums/enums.js";
import { PromptModel } from "../prompts/prompt.model.js";
import {
	WorkspaceColumnName,
	WorkspaceVisibility,
} from "./libs/enums/enums.js";

class WorkspaceModel extends AbstractModel {
	public name!: string;

	public stackTags!: string[];

	public userId!: number;

	public visibility!: ValueOf<typeof WorkspaceVisibility>;

	public static get relationMappings(): RelationMappings {
		return {
			prompts: {
				join: {
					from: `${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`,
					to: `${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
				},
				modelClass: PromptModel,
				relation: this.HasManyRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.WORKSPACES;
	}
}

export { WorkspaceModel };
