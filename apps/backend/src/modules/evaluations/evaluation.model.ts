import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { ComposedPromptModel } from "~/modules/composed-prompts/composed-prompt.model.js";
import { PromptModel } from "~/modules/prompts/prompt.model.js";
import { UserModel } from "~/modules/users/user.model.js";

import { EvaluationColumnName } from "./libs/enums/enums.js";

class EvaluationModel extends AbstractModel {
	public composedPromptId!: null | number;

	public promptId!: null | number;

	public score!: number;

	public userId!: number;

	public static override get relationMappings(): RelationMappings {
		return {
			composedPrompt: {
				join: {
					from: `${DatabaseTableName.EVALUATIONS}.${EvaluationColumnName.COMPOSED_PROMPT_ID}`,
					to: `${DatabaseTableName.COMPOSED_PROMPTS}.id`,
				},
				modelClass: ComposedPromptModel,
				relation: this.BelongsToOneRelation,
			},
			prompt: {
				join: {
					from: `${DatabaseTableName.EVALUATIONS}.${EvaluationColumnName.PROMPT_ID}`,
					to: `${DatabaseTableName.PROMPTS}.id`,
				},
				modelClass: PromptModel,
				relation: this.BelongsToOneRelation,
			},
			user: {
				join: {
					from: `${DatabaseTableName.EVALUATIONS}.${EvaluationColumnName.USER_ID}`,
					to: `${DatabaseTableName.USERS}.id`,
				},
				modelClass: UserModel,
				relation: this.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.EVALUATIONS;
	}
}

export { EvaluationModel };
