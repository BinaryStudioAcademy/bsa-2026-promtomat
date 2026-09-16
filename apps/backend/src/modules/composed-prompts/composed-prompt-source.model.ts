import { type Modifiers, type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { PromptColumnName } from "../prompts/libs/enums/enums.js";
import { PromptModel } from "../prompts/prompt.model.js";
import {
	ORDER_BY_RANK_MODIFIER,
	PROMPT_RELATION,
} from "./libs/constants/constants.js";
import { ComposedPromptSourceColumnName } from "./libs/enums/enums.js";

class ComposedPromptSourceModel extends AbstractModel {
	public composedPromptId!: number;

	public prompt!: PromptModel;

	public promptId!: number;

	public rank!: number;

	public static get modifiers(): Modifiers {
		return {
			[ORDER_BY_RANK_MODIFIER]: (query) => {
				void query.orderBy(ComposedPromptSourceColumnName.RANK);
			},
		};
	}

	public static get relationMappings(): RelationMappings {
		return {
			[PROMPT_RELATION]: {
				join: {
					from: `${DatabaseTableName.COMPOSED_PROMPT_SOURCES}.${ComposedPromptSourceColumnName.PROMPT_ID}`,
					to: `${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`,
				},
				modelClass: PromptModel,
				relation: this.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.COMPOSED_PROMPT_SOURCES;
	}
}

export { ComposedPromptSourceModel };
