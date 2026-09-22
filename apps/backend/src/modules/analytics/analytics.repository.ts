import { type QueryBuilder, raw } from "objection";

import {
	AnalyticsGrowthBucket,
	ScoreTierMin,
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
import { LABEL_RELATION, LOOKBACK_OFFSET } from "./libs/constants/constants.js";
import {
	AnalyticsDistributionAlias,
	AnalyticsRepositoryConfig,
	GrowthBucketConfig,
	WeeklyChangeWindow,
} from "./libs/enums/enums.js";
import {
	type AnalyticsScopeQuery,
	type PromptDistributionCountRow,
	type PromptGrowthRow,
	type PromptKeywordRow,
	type PromptSummaryRow,
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
				raw("COALESCE(sum(case when ??.?? < ? then 1 else 0 end), 0) as ??", [
					DatabaseTableName.PROMPTS,
					PromptColumnName.EFFICIENCY_SCORE,
					ScoreTierMin.MID,
					AnalyticsDistributionAlias.LOW,
				]),
				raw(
					"COALESCE(sum(case when ??.?? >= ? and ??.?? < ? then 1 else 0 end), 0) as ??",
					[
						DatabaseTableName.PROMPTS,
						PromptColumnName.EFFICIENCY_SCORE,
						ScoreTierMin.MID,
						DatabaseTableName.PROMPTS,
						PromptColumnName.EFFICIENCY_SCORE,
						ScoreTierMin.HIGH,
						AnalyticsDistributionAlias.MID,
					],
				),
				raw("COALESCE(sum(case when ??.?? >= ? then 1 else 0 end), 0) as ??", [
					DatabaseTableName.PROMPTS,
					PromptColumnName.EFFICIENCY_SCORE,
					ScoreTierMin.HIGH,
					AnalyticsDistributionAlias.HIGH,
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
				raw("to_char(date_trunc(?, ??.??), ?) as ??", [
					unit,
					DatabaseTableName.PROMPTS,
					PromptColumnName.CREATED_AT,
					AnalyticsRepositoryConfig.BUCKET_DATE_FORMAT,
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
			.castTo<{ averageScore: null | string; bucket: string }[]>();

		this.findScope(query, userId, workspaceId);

		const rows = await query.execute();

		return rows.map((row) => ({
			averageScore: row.averageScore === null ? null : Number(row.averageScore),
			bucket: row.bucket,
		}));
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
			.orderBy(SQLAlias.LABEL, SortOrder.ASC)
			.limit(AnalyticsRepositoryConfig.KEYWORD_LIMIT)
			.castTo<{ averageScore: string; count: string; label: string }[]>();

		this.findScope(query, userId, workspaceId);

		const rows = await query.execute();

		return rows.map((row) => ({
			averageScore: Number(row.averageScore),
			count: Number(row.count),
			label: row.label,
		}));
	}

	public async findSummary({
		userId,
		workspaceId,
	}: AnalyticsScopeQuery): Promise<PromptSummaryRow> {
		const query = this.promptModel
			.query()
			.avg(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE} as ${SQLAlias.AVERAGE_SCORE}`,
			)
			.countDistinct(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.LABEL_ID} as ${SQLAlias.KEYWORD_COUNT}`,
			)
			.select(
				raw(
					"avg(case when ??.?? >= date_trunc('day', now()) - (?)::interval then ??.?? end) as ??",
					[
						DatabaseTableName.PROMPTS,
						PromptColumnName.CREATED_AT,
						`${String(WeeklyChangeWindow.CURRENT_LOOKBACK_DAYS)} day`,
						DatabaseTableName.PROMPTS,
						PromptColumnName.EFFICIENCY_SCORE,
						SQLAlias.CURRENT_SCORE,
					],
				),
				raw(
					"avg(case when ??.?? >= date_trunc('day', now()) - (?)::interval and ??.?? < date_trunc('day', now()) - (?)::interval then ??.?? end) as ??",
					[
						DatabaseTableName.PROMPTS,
						PromptColumnName.CREATED_AT,
						`${String(WeeklyChangeWindow.PREVIOUS_LOOKBACK_DAYS)} day`,
						DatabaseTableName.PROMPTS,
						PromptColumnName.CREATED_AT,
						`${String(WeeklyChangeWindow.CURRENT_LOOKBACK_DAYS)} day`,
						DatabaseTableName.PROMPTS,
						PromptColumnName.EFFICIENCY_SCORE,
						SQLAlias.PREVIOUS_SCORE,
					],
				),
			)
			.castTo<
				{
					averageScore: null | string;
					currentScore: null | string;
					keywordCount: string;
					previousScore: null | string;
				}[]
			>();

		this.findScope(query, userId, workspaceId);

		const [row] = await query.execute();

		if (!row) {
			return {
				averageScore: null,
				currentScore: null,
				keywordCount: 0,
				previousScore: null,
			};
		}

		return {
			averageScore: row.averageScore === null ? null : Number(row.averageScore),
			currentScore: row.currentScore === null ? null : Number(row.currentScore),
			keywordCount: Number(row.keywordCount),
			previousScore:
				row.previousScore === null ? null : Number(row.previousScore),
		};
	}
}

export { AnalyticsRepository };
