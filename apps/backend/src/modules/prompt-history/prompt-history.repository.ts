import { type QueryBuilder, raw } from "objection";

import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { ScoreTierMin } from "~/libs/enums/enums.js";
import { escapeILikePattern } from "~/libs/helpers/helpers.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { type Embedding } from "~/libs/modules/embedding/embedding.js";
import { type ComposedPromptModel } from "~/modules/composed-prompts/composed-prompt.model.js";
import { ColumnName as ComposedPromptColumnName } from "~/modules/composed-prompts/libs/enums/column-name.enum.js";
import { EvaluationColumnName } from "~/modules/evaluations/libs/enums/enums.js";
import {
	MAX_EFFICIENCY_SCORE,
	MAX_SIMILARITY,
	SIMILARITY_THRESHOLD,
} from "~/modules/prompt-embeddings/libs/constants/constants.js";
import {
	PromptEmbeddingColumnName,
	RelevanceWeight,
} from "~/modules/prompt-embeddings/libs/enums/enums.js";
import { serializeEmbedding } from "~/modules/prompt-embeddings/libs/helpers/helpers.js";
import {
	PaginationValue,
	PromptColumnName,
} from "~/modules/prompts/libs/enums/enums.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";

import {
	PromptHistoryScoreTier,
	PromptHistorySqlAlias,
} from "./libs/enums/enums.js";
import {
	type PromptHistoryFindAllResult,
	type PromptHistoryGetQueryDto,
	type PromptHistoryRawRow,
} from "./libs/types/types.js";

type BranchFilters = {
	embedding: Embedding | null;
	qualityTier?: string | undefined;
	search?: string | undefined;
	userId: number;
	workspaceId: number;
};

class PromptHistoryRepository {
	private composedPromptModel: typeof ComposedPromptModel;

	private promptModel: typeof PromptModel;

	public constructor(
		promptModel: typeof PromptModel,
		composedPromptModel: typeof ComposedPromptModel,
	) {
		this.promptModel = promptModel;
		this.composedPromptModel = composedPromptModel;
	}

	private applyQualityTierCondition(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		builder: QueryBuilder<any>,
		scoreReference: ReturnType<typeof raw> | string,
		qualityTier?: string,
	): void {
		if (!qualityTier || qualityTier === PromptHistoryScoreTier.ALL) {
			return;
		}

		if (qualityTier === PromptHistoryScoreTier.UNRATED) {
			builder.whereNull(scoreReference);

			return;
		}

		switch (qualityTier) {
			case PromptHistoryScoreTier.HIGH: {
				builder.where(scoreReference, ">=", ScoreTierMin.HIGH);
				break;
			}
			case PromptHistoryScoreTier.LOW: {
				builder.where(scoreReference, "<", ScoreTierMin.MID);
				break;
			}
			case PromptHistoryScoreTier.MID: {
				builder
					.where(scoreReference, ">=", ScoreTierMin.MID)
					.andWhere(scoreReference, "<", ScoreTierMin.HIGH);
				break;
			}
		}
	}

	private buildComposedBranch({
		qualityTier,
		search,
		userId,
		workspaceId,
	}: BranchFilters): QueryBuilder<ComposedPromptModel> {
		const query = this.composedPromptModel
			.query()
			.select(
				raw("?? as id", [
					`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.ID}`,
				]),
				raw(`?? as ${PromptHistorySqlAlias.CREATED_AT}`, [
					`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.CREATED_AT}`,
				]),
				raw("?? as body", [
					`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.BODY}`,
				]),
				raw("?? as intent", [
					`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.DESCRIPTION}`,
				]),
				raw("?? as workspace_id", [
					`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.WORKSPACE_ID}`,
				]),
				raw("?? as user_id", [
					`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.REQUESTER_ID}`,
				]),
				raw(`true as ${PromptHistorySqlAlias.IS_COMPOSED}`),
				raw("0 as score"),
				raw(`?? as ${PromptHistorySqlAlias.COMPUTED_SCORE}`, [
					`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.COMPUTED_SCORE}`,
				]),
				raw("(SELECT ?? FROM ?? WHERE ?? = ?? AND ?? = ? LIMIT 1) as ??", [
					EvaluationColumnName.SCORE,
					DatabaseTableName.EVALUATIONS,
					`${DatabaseTableName.EVALUATIONS}.${EvaluationColumnName.COMPOSED_PROMPT_ID}`,
					`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.ID}`,
					`${DatabaseTableName.EVALUATIONS}.${EvaluationColumnName.USER_ID}`,
					userId,
					PromptHistorySqlAlias.MY_SCORE,
				]),
				raw("0 as ??", [PromptHistorySqlAlias.SORT_SCORE]),
			)
			.where(
				`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.WORKSPACE_ID}`,
				workspaceId,
			);

		this.applyQualityTierCondition(
			query,
			`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.COMPUTED_SCORE}`,
			qualityTier,
		);

		if (search) {
			const escapedSearch = escapeILikePattern(search);

			query.where((builder) => {
				builder
					.whereILike(
						`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.DESCRIPTION}`,
						`%${escapedSearch}%`,
					)
					.orWhereILike(
						`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.BODY}`,
						`%${escapedSearch}%`,
					);
			});
		}

		return query;
	}

	private buildFilteredUnion(
		filters: BranchFilters,
	): QueryBuilder<PromptModel> {
		return this.buildRegularBranch(filters).unionAll(
			this.buildComposedBranch(filters),
			true,
		);
	}

	private buildRegularBranch({
		embedding,
		qualityTier,
		userId,
		workspaceId,
	}: BranchFilters): QueryBuilder<PromptModel> {
		const query = this.promptModel
			.query()
			.select(
				raw("?? as id", [
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`,
				]),
				raw(`?? as ${PromptHistorySqlAlias.CREATED_AT}`, [
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.CREATED_AT}`,
				]),
				raw("?? as body", [
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.PROMPT_BODY}`,
				]),
				raw("?? as intent", [
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.TASK_INTENT}`,
				]),
				raw("?? as workspace_id", [
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
				]),
				raw("?? as user_id", [
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.USER_ID}`,
				]),
				raw(`false as ${PromptHistorySqlAlias.IS_COMPOSED}`),
				raw("?? as score", [
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE}`,
				]),
				raw(`?? as ${PromptHistorySqlAlias.COMPUTED_SCORE}`, [
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
				]),
				raw("(SELECT ?? FROM ?? WHERE ?? = ?? AND ?? = ? LIMIT 1) as ??", [
					EvaluationColumnName.SCORE,
					DatabaseTableName.EVALUATIONS,
					`${DatabaseTableName.EVALUATIONS}.${EvaluationColumnName.PROMPT_ID}`,
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`,
					`${DatabaseTableName.EVALUATIONS}.${EvaluationColumnName.USER_ID}`,
					userId,
					PromptHistorySqlAlias.MY_SCORE,
				]),
				this.buildRegularSortScoreSelect(embedding),
			)
			.where(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
				workspaceId,
			);

		this.applyQualityTierCondition(
			query,
			raw("COALESCE(??, ??)", [
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE}`,
			]),
			qualityTier,
		);

		if (embedding) {
			const serializedEmbedding = serializeEmbedding(embedding);

			query
				.join(
					DatabaseTableName.PROMPT_EMBEDDINGS,
					`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.PROMPT_ID}`,
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`,
				)
				.where(
					raw("?? <=> ?::vector", [
						`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.EMBEDDING}`,
						serializedEmbedding,
					]),
					"<",
					SIMILARITY_THRESHOLD,
				);
		}

		return query;
	}

	private buildRegularSortScoreSelect(
		embedding: Embedding | null,
	): ReturnType<typeof raw> {
		if (!embedding) {
			return raw("0 as ??", [PromptHistorySqlAlias.SORT_SCORE]);
		}

		const serializedEmbedding = serializeEmbedding(embedding);

		return raw(
			"(? * (? - (?? <=> ?::vector) / ?) + ? * (COALESCE(??, ??)::numeric / ?)) as ??",
			[
				RelevanceWeight.SIMILARITY_WEIGHT,
				MAX_SIMILARITY,
				`${DatabaseTableName.PROMPT_EMBEDDINGS}.${PromptEmbeddingColumnName.EMBEDDING}`,
				serializedEmbedding,
				SIMILARITY_THRESHOLD,
				RelevanceWeight.EFFICIENCY_SCORE_WEIGHT,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE}`,
				MAX_EFFICIENCY_SCORE,
				PromptHistorySqlAlias.SORT_SCORE,
			],
		);
	}

	public async findAll(
		query: PromptHistoryGetQueryDto,
		requesterId: number,
		embedding: Embedding | null,
	): Promise<PromptHistoryFindAllResult> {
		const {
			limit = PaginationValue.DEFAULT_LIMIT,
			page = PaginationValue.DEFAULT_PAGE,
			qualityTier,
			search,
			workspaceId,
		} = query;

		const offset = (page - PaginationValue.DEFAULT_PAGE) * limit;
		const filters = {
			embedding,
			qualityTier,
			search,
			userId: requesterId,
			workspaceId,
		};

		const unifiedQuery = this.buildFilteredUnion(filters);

		if (embedding) {
			unifiedQuery
				.orderBy(PromptHistorySqlAlias.IS_COMPOSED, "asc")
				.orderBy(PromptHistorySqlAlias.SORT_SCORE, "desc");
		}

		const [rows, [aggregate]] = await Promise.all([
			unifiedQuery
				.orderBy(PromptHistorySqlAlias.CREATED_AT, "desc")
				.limit(limit)
				.offset(offset)
				.castTo<PromptHistoryRawRow[]>()
				.execute(),
			this.promptModel
				.query()
				.from(this.buildFilteredUnion(filters).as("unified_prompt_history"))
				.select(
					raw("COUNT(??) as ??", ["id", PromptHistorySqlAlias.TOTAL_COUNT]),
					raw("AVG(COALESCE(??, NULLIF(??, 0))) as ??", [
						PromptHistorySqlAlias.COMPUTED_SCORE,
						"score",
						PromptHistorySqlAlias.AVERAGE_SCORE,
					]),
				)
				.castTo<{ averageScore: null | string; totalCount: string }[]>()
				.execute(),
		]);

		return {
			averageScore: aggregate?.averageScore
				? Number(aggregate.averageScore)
				: null,
			items: rows.map((row) => ({
				body: row.body,
				computedScore:
					row.computedScore === null ? null : Number(row.computedScore),
				createdAt: row.createdAt,
				id: row.id,
				intent: row.intent,
				isComposed: row.isComposed,
				myScore: row.myScore,
				score: row.score,
				userId: row.userId,
				workspaceId: row.workspaceId,
				workspaceName: "",
			})),
			totalCount: aggregate?.totalCount
				? Number(aggregate.totalCount)
				: ZERO_VALUE,
		};
	}
}

export { PromptHistoryRepository };
