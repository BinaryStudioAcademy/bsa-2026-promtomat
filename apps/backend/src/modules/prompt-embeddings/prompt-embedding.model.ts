import { type Pojo, type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { type Embedding } from "~/libs/modules/embedding/embedding.js";

import { PromptColumnName } from "../prompts/libs/enums/enums.js";
import { PromptModel } from "../prompts/prompt.model.js";
import { PromptEmbeddingColumnName } from "./libs/enums/enums.js";
import {
	checkIsEmbedding,
	parseEmbedding,
	serializeEmbedding,
} from "./libs/helpers/helpers.js";

class PromptEmbeddingModel extends AbstractModel {
	public embedding!: Embedding;

	public modelId!: string;

	public promptId!: number;

	public sourceHash!: string;

	public static get relationMappings(): RelationMappings {
		return {
			prompt: {
				join: {
					from: `${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.PROMPT_ID}`,
					to: `${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`,
				},
				modelClass: PromptModel,
				relation: this.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.PROMPT_EMBEDDINGS;
	}

	public override $formatDatabaseJson(json: Pojo): Pojo {
		const formatted = super.$formatDatabaseJson(json);
		const embedding: unknown = formatted[PromptEmbeddingColumnName.EMBEDDING];

		if (checkIsEmbedding(embedding)) {
			formatted[PromptEmbeddingColumnName.EMBEDDING] =
				serializeEmbedding(embedding);
		}

		return formatted;
	}

	public override $parseDatabaseJson(json: Pojo): Pojo {
		const parsed = super.$parseDatabaseJson(json);
		const embedding: unknown = parsed[PromptEmbeddingColumnName.EMBEDDING];

		if (typeof embedding === "string") {
			parsed[PromptEmbeddingColumnName.EMBEDDING] = parseEmbedding(embedding);
		}

		return parsed;
	}
}

export { PromptEmbeddingModel };
