import { raw } from "objection";

import {
	AVERAGE_SCORE_ALIAS,
	COUNT_ALIAS,
	WORKSPACE_NAME_ALIAS,
} from "~/libs/constants/constants.js";
import { SortOrder } from "~/libs/enums/enums.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { PromptColumnName } from "~/modules/prompts/libs/enums/enums.js";
import { WorkspaceColumnName } from "~/modules/workspaces/libs/enums/enums.js";

import { ZERO_VALUE } from "../prompts/libs/constants/constants.js";
import { type PromptRepositoryItem } from "../prompts/libs/types/prompt-repository-item.type.js";
import {
	COLUMN_TYPE_ALIAS,
	DISTANCE_ALIAS,
	MAX_EFFICIENCY_SCORE,
	MAX_SIMILARITY,
	PG_ATTRIBUTE_TABLE,
	PROMPT_RELATION,
	PROMPT_WORKSPACE_ALIAS,
	PROMPT_WORKSPACE_RELATION,
	SIMILARITY_THRESHOLD,
} from "./libs/constants/constants.js";
import {
	PgAttributeColumnName,
	PromptEmbeddingColumnName,
	RelevanceWeight,
} from "./libs/enums/enums.js";
import {
	parseVectorDimension,
	serializeEmbedding,
} from "./libs/helpers/helpers.js";
import {
	type ColumnTypeRow,
	type IndexedPromptSource,
	type NearestPrompt,
	type NearestPromptQuery,
	type PromptAggregateRow,
	type PromptSemanticSearchQuery,
	type PromptSemanticSearchResult,
} from "./libs/types/types.js";
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

	public async findAll({
		embedding,
		limit,
		offset,
		score,
		userId,
		workspaceId,
	}: PromptSemanticSearchQuery): Promise<PromptSemanticSearchResult> {
		const serializedEmbeddings = serializeEmbedding(embedding);

		const baseQuery = this.promptEmbeddingModel
			.query()
			.joinRelated(PROMPT_WORKSPACE_RELATION)
			.where(`${PROMPT_RELATION}.${PromptColumnName.USER_ID}`, userId)
			.where(
				raw("?? <=> ?::vector", [
					`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.EMBEDDING}`,
					serializedEmbeddings,
				]),
				"<",
				SIMILARITY_THRESHOLD,
			);

		if (workspaceId) {
			baseQuery.where(
				`${PROMPT_RELATION}.${PromptColumnName.WORKSPACE_ID}`,
				workspaceId,
			);
		}

		if (score) {
			baseQuery.where(
				`${PROMPT_RELATION}.${PromptColumnName.EFFICIENCY_SCORE}`,
				score,
			);
		}

		const [aggregation] = await baseQuery
			.clone()
			.clearSelect()
			.count(`${PROMPT_RELATION}.${PromptColumnName.ID} as ${COUNT_ALIAS}`)
			.avg(
				`${PROMPT_RELATION}.${PromptColumnName.EFFICIENCY_SCORE} as ${AVERAGE_SCORE_ALIAS}`,
			)
			.castTo<PromptAggregateRow[]>()
			.execute();

		const items = await baseQuery
			.clone()
			.select(
				`${PROMPT_RELATION}.${PromptColumnName.ID}`,
				`${PROMPT_RELATION}.${PromptColumnName.WORKSPACE_ID}`,
				`${PROMPT_RELATION}.${PromptColumnName.TASK_INTENT}`,
				`${PROMPT_RELATION}.${PromptColumnName.CREATED_AT}`,
				`${PROMPT_RELATION}.${PromptColumnName.UPDATED_AT}`,
				`${PROMPT_RELATION}.${PromptColumnName.USER_ID}`,
				`${PROMPT_RELATION}.${PromptColumnName.PROMPT_BODY}`,
				`${PROMPT_RELATION}.${PromptColumnName.EFFICIENCY_SCORE}`,
				raw("?? AS ??", [
					`${PROMPT_WORKSPACE_ALIAS}.${WorkspaceColumnName.NAME}`,
					WORKSPACE_NAME_ALIAS,
				]),
			)
			.orderByRaw(
				`(? * (? - (?? <=> ?::vector) / ?) + ? * (??::numeric / ?)) ${SortOrder.DESC}`,
				[
					RelevanceWeight.SIMILARITY_WEIGHT,
					MAX_SIMILARITY,
					`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.EMBEDDING}`,
					serializedEmbeddings,
					SIMILARITY_THRESHOLD,
					RelevanceWeight.EFFICIENCY_SCORE_WEIGHT,
					`${PROMPT_RELATION}.${PromptColumnName.EFFICIENCY_SCORE}`,
					MAX_EFFICIENCY_SCORE,
				],
			)
			.offset(offset)
			.limit(limit)
			.castTo<PromptRepositoryItem[]>()
			.execute();

		return {
			averageScore: aggregation?.averageScore
				? Number(aggregation.averageScore)
				: null,
			items,
			totalCount: aggregation?.count ? Number(aggregation.count) : ZERO_VALUE,
		};
	}

	public async findIndexedSourcesAfter(
		afterId: number,
		limit: number,
	): Promise<IndexedPromptSource[]> {
		const promptId = `${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`;

		return await this.promptEmbeddingModel
			.knex()
			.select<IndexedPromptSource[]>(
				promptId,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.TASK_INTENT}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.PROMPT_BODY}`,
				`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.MODEL_ID}`,
				`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.SOURCE_HASH}`,
			)
			.from(DatabaseTableName.PROMPTS)
			.leftJoin(
				DatabaseTableName.PROMPT_EMBEDDINGS,
				`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.PROMPT_ID}`,
				promptId,
			)
			.where(promptId, ">", afterId)
			.orderBy(promptId)
			.limit(limit);
	}

	public async findNearest({
		embedding,
		limit,
		workspaceId,
	}: NearestPromptQuery): Promise<NearestPrompt[]> {
		const serializedEmbeddings = serializeEmbedding(embedding);

		return await this.promptEmbeddingModel
			.query()
			.select(
				`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.PROMPT_ID}`,
				`${PROMPT_RELATION}.${PromptColumnName.TASK_INTENT}`,
				`${PROMPT_RELATION}.${PromptColumnName.PROMPT_BODY}`,
				`${PROMPT_RELATION}.${PromptColumnName.EFFICIENCY_SCORE}`,
				raw("?? <=> ?::vector AS ??", [
					`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.EMBEDDING}`,
					serializedEmbeddings,
					DISTANCE_ALIAS,
				]),
			)
			.joinRelated(PROMPT_RELATION)
			.where(`${PROMPT_RELATION}.${PromptColumnName.WORKSPACE_ID}`, workspaceId)
			.where(
				raw("?? <=> ?::vector", [
					`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.EMBEDDING}`,
					serializedEmbeddings,
				]),
				"<",
				SIMILARITY_THRESHOLD,
			)
			.orderByRaw(
				`(? * (? - (?? <=> ?::vector) / ?) + ? * (??::numeric / ?)) ${SortOrder.DESC}`,
				[
					RelevanceWeight.SIMILARITY_WEIGHT,
					MAX_SIMILARITY,
					`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.EMBEDDING}`,
					serializedEmbeddings,
					SIMILARITY_THRESHOLD,
					RelevanceWeight.EFFICIENCY_SCORE_WEIGHT,
					`${PROMPT_RELATION}.${PromptColumnName.EFFICIENCY_SCORE}`,
					MAX_EFFICIENCY_SCORE,
				],
			)
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
