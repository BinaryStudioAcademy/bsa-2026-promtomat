import { raw } from "objection";

import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { type Embedding } from "~/libs/modules/embedding/embedding.js";

import {
	COLUMN_TYPE_ALIAS,
	DISTANCE_ALIAS,
	PG_ATTRIBUTE_TABLE,
} from "./libs/constants/constants.js";
import {
	PgAttributeColumnName,
	PromptEmbeddingColumnName,
} from "./libs/enums/enums.js";
import {
	parseVectorDimension,
	serializeEmbedding,
} from "./libs/helpers/helpers.js";
import { type ColumnTypeRow, type NearestPrompt } from "./libs/types/types.js";
import { PromptEmbeddingEntity } from "./prompt-embedding.entity.js";
import { type PromptEmbeddingModel } from "./prompt-embedding.model.js";

class PromptEmbeddingRepository {
	private promptEmbeddingModel: typeof PromptEmbeddingModel;

	public constructor(promptEmbeddingModel: typeof PromptEmbeddingModel) {
		this.promptEmbeddingModel = promptEmbeddingModel;
	}

	public async createOrUpdate(
		entity: PromptEmbeddingEntity,
	): Promise<PromptEmbeddingEntity> {
		const promptEmbedding = await this.promptEmbeddingModel
			.query()
			.insert(entity.toNewObject())
			.onConflict(PromptEmbeddingColumnName.PROMPT_ID)
			.merge([
				PromptEmbeddingColumnName.EMBEDDING,
				PromptEmbeddingColumnName.MODEL_ID,
				PromptEmbeddingColumnName.SOURCE_HASH,
				PromptEmbeddingColumnName.UPDATED_AT,
			])
			.returning("*")
			.execute();

		return PromptEmbeddingEntity.initialize(promptEmbedding);
	}

	public async findNearest(
		embedding: Embedding,
		limit: number,
	): Promise<NearestPrompt[]> {
		return await this.promptEmbeddingModel
			.query()
			.select(
				PromptEmbeddingColumnName.PROMPT_ID,
				raw("?? <=> ?::vector AS ??", [
					PromptEmbeddingColumnName.EMBEDDING,
					serializeEmbedding(embedding),
					DISTANCE_ALIAS,
				]),
			)
			.orderBy(DISTANCE_ALIAS)
			.limit(limit)
			.castTo<NearestPrompt[]>()
			.execute();
	}

	public async findSchemaDimension(): Promise<null | number> {
		const knex = this.promptEmbeddingModel.knex();
		const rows = await knex
			.select<ColumnTypeRow[]>(
				knex.raw("format_type(??, ??) AS ??", [
					PgAttributeColumnName.TYPE_ID,
					PgAttributeColumnName.TYPE_MODIFIER,
					COLUMN_TYPE_ALIAS,
				]),
			)
			.from(PG_ATTRIBUTE_TABLE)
			.where(
				PgAttributeColumnName.RELATION_ID,
				knex.raw("?::regclass", [DatabaseTableName.PROMPT_EMBEDDINGS]),
			)
			.where(PgAttributeColumnName.NAME, PromptEmbeddingColumnName.EMBEDDING);
		const [row] = rows;

		return row ? parseVectorDimension(row.columnType) : null;
	}
}

export { PromptEmbeddingRepository };
