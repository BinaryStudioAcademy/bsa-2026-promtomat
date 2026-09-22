import { AnalyticsGrowthBucket } from "~/libs/enums/enums.js";
import {
	type AnalyticsDistributionResponseDto,
	type AnalyticsGrowthResponseDto,
	type AnalyticsKeywordResponseDto,
	type AnalyticsSummaryResponseDto,
	ValueOf,
} from "~/libs/types/types.js";

import { AnalyticsRepository } from "./analytics.repository.js";
import { countPercentage } from "./libs/helpers/count-percentage.js";
import { fillGrowthGaps } from "./libs/helpers/fill-growth-gaps.helper.js";
import { getWeeklyChange } from "./libs/helpers/get-weekly-change.helper.js";
import { roundScore } from "./libs/helpers/round-score.helper.js";
import { type AnalyticsScopeQuery } from "./libs/types/types.js";

class AnalyticsService {
	private analyticsRepository: AnalyticsRepository;

	public constructor(analyticsRepository: AnalyticsRepository) {
		this.analyticsRepository = analyticsRepository;
	}

	public async findDistribution({
		userId,
		workspaceId,
	}: AnalyticsScopeQuery): Promise<AnalyticsDistributionResponseDto> {
		const { high, low, mid } = await this.analyticsRepository.findDistribution({
			userId,
			workspaceId,
		});

		const total = high + mid + low;
		return {
			high: {
				count: high,
				percentage: countPercentage(high, total),
			},
			low: {
				count: low,
				percentage: countPercentage(low, total),
			},
			mid: {
				count: mid,
				percentage: countPercentage(mid, total),
			},
		};
	}

	public async findGrowth({
		granularity,
		userId,
		workspaceId,
	}: AnalyticsScopeQuery & {
		granularity: ValueOf<typeof AnalyticsGrowthBucket>;
	}): Promise<AnalyticsGrowthResponseDto> {
		const rows = await this.analyticsRepository.findGrowth({
			granularity,
			userId,
			workspaceId,
		});

		const points = fillGrowthGaps(rows, granularity);

		return {
			points: points.map((point) => ({
				averageScore:
					point.averageScore === null ? null : roundScore(point.averageScore),
				date: point.date,
			})),
		};
	}

	public async findKeywordWeights({
		userId,
		workspaceId,
	}: AnalyticsScopeQuery): Promise<AnalyticsKeywordResponseDto> {
		const rows = await this.analyticsRepository.findKeywordWeights({
			userId,
			workspaceId,
		});

		return {
			items: rows.map((row) => ({
				...row,
				averageScore: roundScore(row.averageScore),
			})),
		};
	}

	public async findSummary({
		userId,
		workspaceId,
	}: AnalyticsScopeQuery): Promise<AnalyticsSummaryResponseDto> {
		const { averageScore, currentScore, keywordCount, previousScore } =
			await this.analyticsRepository.findSummary({ userId, workspaceId });

		return {
			averageScore: averageScore === null ? null : roundScore(averageScore),
			keywordCount,
			weeklyChange: getWeeklyChange({ currentScore, previousScore }),
		};
	}
}

export { AnalyticsService };
