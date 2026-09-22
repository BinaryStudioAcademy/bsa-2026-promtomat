import { raw, type Transaction } from "objection";

import { PromptQualityTier, SortOrder, SQLAlias } from "~/libs/enums/enums.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { LabelColumnName } from "~/modules/labels/libs/enums/enums.js";
import { ZERO_VALUE } from "~/modules/prompts/libs/constants/constants.js";
import { PromptColumnName } from "~/modules/prompts/libs/enums/enums.js";
import { type PromptRepositoryItem } from "~/modules/prompts/libs/types/types.js";
import { WorkspaceColumnName } from "~/modules/workspaces/libs/enums/enums.js";

import {
	COLUMN_TYPE_ALIAS,
	DISTANCE_ALIAS,
	MAX_EFFICIENCY_SCORE,
	MAX_SIMILARITY,
	NEAREST_LABEL_RELATION,
	NEAREST_PROMPT_SEARCH_LIMIT,
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

const QUALITY_SCORE_THRESHOLD = {
	MAX_NEEDS_IMPROVEMENT: 5,
	MIN_NEEDS_IMPROVEMENT: 1,
	PROVEN: 8,
	USABLE: 6,
} as const;

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

	public async deleteByPromptId(
		promptId: number,
		trx?: Transaction,
	): Promise<void> {
		await this.promptEmbeddingModel
			.query(trx)
			.delete()
			.where(PromptEmbeddingColumnName.PROMPT_ID, promptId)
			.execute();
	}

	public async findAll({
		embedding,
		limit,
		offset,
		qualityTier,
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

		if (qualityTier && qualityTier !== PromptQualityTier.ALL) {
			switch (qualityTier) {
				case PromptQualityTier.NEEDS_IMPROVEMENT: {
					baseQuery
						.where(
							`${PROMPT_RELATION}.${PromptColumnName.COMPUTED_SCORE}`,
							">=",
							QUALITY_SCORE_THRESHOLD.MIN_NEEDS_IMPROVEMENT,
						)
						.andWhere(
							`${PROMPT_RELATION}.${PromptColumnName.COMPUTED_SCORE}`,
							"<=",
							QUALITY_SCORE_THRESHOLD.MAX_NEEDS_IMPROVEMENT,
						);
					break;
				}
				case PromptQualityTier.PROVEN: {
					baseQuery.where(
						`${PROMPT_RELATION}.${PromptColumnName.COMPUTED_SCORE}`,
						">=",
						QUALITY_SCORE_THRESHOLD.PROVEN,
					);
					break;
				}
				case PromptQualityTier.UNRATED: {
					baseQuery.whereNull(
						`${PROMPT_RELATION}.${PromptColumnName.COMPUTED_SCORE}`,
					);
					break;
				}
				case PromptQualityTier.USABLE: {
					baseQuery
						.where(
							`${PROMPT_RELATION}.${PromptColumnName.COMPUTED_SCORE}`,
							">=",
							QUALITY_SCORE_THRESHOLD.USABLE,
						)
						.andWhere(
							`${PROMPT_RELATION}.${PromptColumnName.COMPUTED_SCORE}`,
							"<",
							QUALITY_SCORE_THRESHOLD.PROVEN,
						);
					break;
				}
			}
		}

		const [aggregation] = await baseQuery
			.clone()
			.clearSelect()
			.count(`${PROMPT_RELATION}.${PromptColumnName.ID} as ${SQLAlias.COUNT}`)
			.select(
				raw("AVG(COALESCE(??, ??)) as ??", [
					`${PROMPT_RELATION}.${PromptColumnName.COMPUTED_SCORE}`,
					`${PROMPT_RELATION}.${PromptColumnName.EFFICIENCY_SCORE}`,
					SQLAlias.AVERAGE_SCORE,
				]),
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
				`${PROMPT_RELATION}.${PromptColumnName.COMPUTED_SCORE}`,
				raw("?? AS ??", [
					`${PROMPT_WORKSPACE_ALIAS}.${WorkspaceColumnName.NAME}`,
					SQLAlias.WORKSPACE_NAME,
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

	public async findNearestLabelNames({
		embedding,
		limit,
		workspaceId,
	}: NearestPromptQuery): Promise<string[]> {
		const labelName = `${DatabaseTableName.LABELS}.${LabelColumnName.NAME}`;

		const rows = await this.promptEmbeddingModel
			.query()
			.with(NEAREST_LABEL_RELATION, (query) => {
				query
					.select(
						labelName,
						raw("?? <=> ?::vector AS ??", [
							`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.EMBEDDING}`,
							serializeEmbedding(embedding),
							DISTANCE_ALIAS,
						]),
					)
					.from(DatabaseTableName.PROMPT_EMBEDDINGS)
					.innerJoin(
						DatabaseTableName.PROMPTS,
						`${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`,
						`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.PROMPT_ID}`,
					)
					.innerJoin(
						DatabaseTableName.LABELS,
						`${DatabaseTableName.LABELS}.${LabelColumnName.ID}`,
						`${DatabaseTableName.PROMPTS}.${PromptColumnName.LABEL_ID}`,
					)
					.where(
						`${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
						workspaceId,
					)
					.orderBy(DISTANCE_ALIAS)
					.limit(NEAREST_PROMPT_SEARCH_LIMIT);
			})
			.from(NEAREST_LABEL_RELATION)
			.select(LabelColumnName.NAME)
			.groupBy(LabelColumnName.NAME)
			.orderByRaw("MIN(??)", [DISTANCE_ALIAS])
			.limit(limit)
			.castTo<{ name: string }[]>()
			.execute();

		return rows.map((row) => row.name);
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
