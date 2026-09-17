import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { ComposedPromptSourceModel } from "./composed-prompt-source.model.js";
import { SOURCES_RELATION } from "./libs/constants/constants.js";
import {
	ComposedPromptColumnName,
	ComposedPromptSourceColumnName,
} from "./libs/enums/enums.js";

class ComposedPromptModel extends AbstractModel {
	public body!: string;

	public description!: string;

	public descriptionHash!: string;

	public explanation!: string;

	public modelId!: string;

	public requesterId!: number;

	public sources!: ComposedPromptSourceModel[];

	public workspaceId!: number;

	public static get relationMappings(): RelationMappings {
		return {
			[SOURCES_RELATION]: {
				join: {
					from: `${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.ID}`,
					to: `${DatabaseTableName.COMPOSED_PROMPT_SOURCES}.${ComposedPromptSourceColumnName.COMPOSED_PROMPT_ID}`,
				},
				modelClass: ComposedPromptSourceModel,
				relation: this.HasManyRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.COMPOSED_PROMPTS;
	}
}

export { ComposedPromptModel };
