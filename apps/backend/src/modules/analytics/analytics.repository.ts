import { type QueryBuilder, raw } from "objection";

import {
	AnalyticsGrowthBucket,
	ScoreThreshold,
	SortOrder,
	SQLAlias,
} from "~/libs/enums/enums.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";

import { ContributorColumnName } from "../contributors/libs/enums/enums.js";
import { LabelColumnName } from "../labels/libs/enums/enums.js";
import { PromptColumnName } from "../prompts/libs/enums/enums.js";
import { PromptModel } from "../prompts/prompt.model.js";
import { WorkspaceColumnName } from "../workspaces/libs/enums/enums.js";
import {
	GrowthBucketConfig,
	LABEL_RELATION,
	LOOKBACK_OFFSET,
} from "./libs/constants/constants.js";
import {
	AnalyticsDistributionAliases,
	AnalyticsRepositoryConfig,
} from "./libs/enums/enums.js";
import {
	type AnalyticsScopeQuery,
	type PromptDistributionCountRow,
	type PromptGrowthRow,
	type PromptKeywordRow,
} from "./libs/types/types.js";

class AnalyticsRepository {
	private promptModel: typeof PromptModel;

	public constructor(promptModel: typeof PromptModel) {
		this.promptModel = promptModel;
	}

	private findScope<TResult>(
		query: QueryBuilder<PromptModel, TResult>,
		userId: number,
		workspaceId?: number,
	): void {
		if (workspaceId) {
			query.where(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
				"=",
				workspaceId,
			);

			return;
		}

		const contributorAccessQuery = this.promptModel
			.query()
			.select(`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.ID}`)
			.from(DatabaseTableName.CONTRIBUTORS)
			.whereColumn(
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.WORKSPACE_ID}`,
				`${AnalyticsRepositoryConfig.WORKSPACE_RELATION}.${WorkspaceColumnName.ID}`,
			)
			.where(
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.USER_ID}`,
				userId,
			);

		query
			.joinRelated(AnalyticsRepositoryConfig.WORKSPACE_RELATION)
			.where((builder) => {
				builder
					.where(
						`${AnalyticsRepositoryConfig.WORKSPACE_RELATION}.${WorkspaceColumnName.USER_ID}`,
						userId,
					)
					.orWhereExists(contributorAccessQuery);
			});
	}

	public async findDistribution({
		userId,
		workspaceId,
	}: AnalyticsScopeQuery): Promise<PromptDistributionCountRow> {
		const query = this.promptModel
			.query()
			.select(
				raw("COALESCE(sum(case when ??.?? <= ? then 1 else 0 end), 0) as ??", [
					DatabaseTableName.PROMPTS,
					PromptColumnName.EFFICIENCY_SCORE,
					ScoreThreshold.DANGER_MAX,
					AnalyticsDistributionAliases.LOW,
				]),
				raw(
					"COALESCE(sum(case when ??.?? > ? and ??.?? <= ? then 1 else 0 end), 0) as ??",
					[
						DatabaseTableName.PROMPTS,
						PromptColumnName.EFFICIENCY_SCORE,
						ScoreThreshold.DANGER_MAX,
						DatabaseTableName.PROMPTS,
						PromptColumnName.EFFICIENCY_SCORE,
						ScoreThreshold.WARNING_MAX,
						AnalyticsDistributionAliases.MID,
					],
				),
				raw("COALESCE(sum(case when ??.?? > ? then 1 else 0 end), 0) as ??", [
					DatabaseTableName.PROMPTS,
					PromptColumnName.EFFICIENCY_SCORE,
					ScoreThreshold.WARNING_MAX,
					AnalyticsDistributionAliases.HIGH,
				]),
			)
			.castTo<{ high: string; low: string; mid: string }[]>();

		this.findScope(query, userId, workspaceId);

		const [row] = await query.execute();

		if (!row) {
			return { high: 0, low: 0, mid: 0 };
		}

		return {
			high: Number(row.high),
			low: Number(row.low),
			mid: Number(row.mid),
		};
	}

	public async findGrowth({
		granularity,
		userId,
		workspaceId,
	}: AnalyticsScopeQuery & {
		granularity: ValueOf<typeof AnalyticsGrowthBucket>;
	}): Promise<PromptGrowthRow[]> {
		const { count, unit } = GrowthBucketConfig[granularity];
		const lookbackInterval = `${String(count - LOOKBACK_OFFSET)} ${unit}`;

		const query = this.promptModel
			.query()
			.select(
				raw("date_trunc(?, ??.??)::date as ??", [
					unit,
					DatabaseTableName.PROMPTS,
					PromptColumnName.CREATED_AT,
					SQLAlias.BUCKET,
				]),
				raw("avg(??.??) as ??", [
					DatabaseTableName.PROMPTS,
					PromptColumnName.EFFICIENCY_SCORE,
					SQLAlias.AVERAGE_SCORE,
				]),
			)
			.where(
				raw("??.?? >= date_trunc(?, now()) - (?)::interval", [
					DatabaseTableName.PROMPTS,
					PromptColumnName.CREATED_AT,
					unit,
					lookbackInterval,
				]),
			)
			.groupBy(SQLAlias.BUCKET)
			.orderBy(SQLAlias.BUCKET)
			.castTo<PromptGrowthRow[]>();

		this.findScope(query, userId, workspaceId);

		return await query.execute();
	}

	public async findKeywordWeights({
		userId,
		workspaceId,
	}: AnalyticsScopeQuery): Promise<PromptKeywordRow[]> {
		const query = this.promptModel
			.query()
			.joinRelated(LABEL_RELATION)
			.select(`${LABEL_RELATION}.${LabelColumnName.NAME} as ${SQLAlias.LABEL}`)
			.avg(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE} as ${SQLAlias.AVERAGE_SCORE}`,
			)
			.count(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.ID} as ${SQLAlias.COUNT}`,
			)
			.groupBy(
				`${LABEL_RELATION}.${LabelColumnName.ID}`,
				`${LABEL_RELATION}.${LabelColumnName.NAME}`,
			)
			.orderBy(SQLAlias.AVERAGE_SCORE, SortOrder.DESC)
			.limit(AnalyticsRepositoryConfig.KEYWORD_LIMIT)
			.castTo<PromptKeywordRow[]>();

		this.findScope(query, userId, workspaceId);

		return await query.execute();
	}
}

export { AnalyticsRepository };
