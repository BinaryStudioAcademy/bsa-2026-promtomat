import {
	type Modifiers,
	type QueryBuilder,
	type RelationMappings,
} from "objection";

import { escapeILikePattern } from "~/libs/helpers/helpers.js";
import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { LabelModel } from "../labels/label.model.js";
import { LabelColumnName } from "../labels/libs/enums/enums.js";
import { UserColumnName } from "../users/libs/enums/enums.js";
import { UserModel } from "../users/user.model.js";
import { WorkspaceColumnName } from "../workspaces/libs/enums/enums.js";
import { WorkspaceModel } from "../workspaces/workspace.model.js";
import { PromptColumnName } from "./libs/enums/enums.js";
import { type PromptFilterByQueryParameters } from "./libs/types/types.js";

class PromptModel extends AbstractModel {
	public computedScore!: null | number;

	public efficiencyScore!: number;

	public labelId!: number;

	public promptBody!: string;

	public taskIntent!: string;

	public userId!: number;

	public workspace!: WorkspaceModel;

	public workspaceId!: number;

	public static override get modifiers(): Modifiers<
		QueryBuilder<PromptModel, PromptModel[]>
	> {
		return {
			filterByQuery(
				builder,
				{ search, userId, workspaceId }: PromptFilterByQueryParameters,
			) {
				builder.where(
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.USER_ID}`,
					userId,
				);

				if (workspaceId) {
					builder.where(
						`${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
						workspaceId,
					);
				}

				if (search) {
					const escapedSearch = escapeILikePattern(search);
					builder.where((subQuery) => {
						subQuery
							.whereILike(
								`${DatabaseTableName.PROMPTS}.${PromptColumnName.TASK_INTENT}`,
								`%${escapedSearch}%`,
							)
							.orWhereILike(
								`${DatabaseTableName.PROMPTS}.${PromptColumnName.PROMPT_BODY}`,
								`%${escapedSearch}%`,
							);
					});
				}
			},
		};
	}

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
