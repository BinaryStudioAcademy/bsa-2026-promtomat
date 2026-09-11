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

import { UserColumnName } from "../users/libs/enums/enums.js";
import { UserModel } from "../users/user.model.js";
import { WorkspaceColumnName } from "../workspaces/libs/enums/enums.js";
import { WorkspaceModel } from "../workspaces/workspace.model.js";
import { PromptColumnName } from "./libs/enums/enums.js";

class PromptModel extends AbstractModel {
	public efficiencyScore!: number;

	public promptBody!: string;

	public taskIntent!: string;

	public userId!: number;

	public workspace?: WorkspaceModel;

	public workspaceId!: number;

	public static override get modifiers(): Modifiers<
		QueryBuilder<PromptModel, PromptModel[]>
	> {
		return {
			filterByQuery(
				builder,
				{
					score,
					search,
					userId,
					workspaceId,
				}: {
					score?: number;
					search?: string;
					userId: number;
					workspaceId?: number;
				},
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

				if (score) {
					builder.where(
						`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE}`,
						score,
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
			user: {
				join: {
					from: `${DatabaseTableName.PROMPTS}.userId`,
					to: `${DatabaseTableName.USERS}.${UserColumnName.ID}`,
				},
				modelClass: UserModel,
				relation: this.BelongsToOneRelation,
			},
			workspace: {
				join: {
					from: `${DatabaseTableName.PROMPTS}.workspaceId`,
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
