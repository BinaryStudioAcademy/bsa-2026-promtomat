import { type Modifiers, type QueryBuilder, RelationMappings } from "objection";

import { escapeILikePattern } from "~/libs/helpers/helpers.js";
import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { UserColumnName } from "../users/libs/enums/enums.js";
import { UserModel } from "../users/user.model.js";
import {
	WorkspaceColumnName,
	WorkspaceVisibility,
} from "../workspaces/libs/enums/enums.js";
import { WorkspaceModel } from "../workspaces/workspace.model.js";
import { PromptColumnName, PromptScope } from "./libs/enums/enums.js";

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
					scope,
					score,
					search,
					userId,
					workspaceId,
				}: {
					scope?: string;
					score?: number;
					search?: string;
					userId: number;
					workspaceId?: number;
				},
			) {
				if (scope === PromptScope.MINE) {
					builder.where(`${DatabaseTableName.PROMPTS}.userId`, userId);
				} else {
					builder.where((subQuery) => {
						subQuery
							.where(
								`${DatabaseTableName.WORKSPACES}.visibility`,
								WorkspaceVisibility.PUBLIC,
							)
							.orWhere(`${DatabaseTableName.WORKSPACES}.userId`, userId);
					});
				}

				if (workspaceId) {
					builder.where(
						`${DatabaseTableName.PROMPTS}.workspaceId`,
						workspaceId,
					);
				}

				if (score) {
					builder.where(`${DatabaseTableName.PROMPTS}.efficiencyScore`, score);
				}

				if (search) {
					const escapedSearch = escapeILikePattern(search);
					builder.where((subQuery) => {
						subQuery
							.whereILike(
								`${DatabaseTableName.PROMPTS}.taskIntent`,
								`%${escapedSearch}%`,
							)
							.orWhereILike(
								`${DatabaseTableName.PROMPTS}.promptBody`,
								`%${escapedSearch}%`,
							);
					});
				}
			},
		};
	}

	public static get relationMappings(): RelationMappings {
		return {
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
