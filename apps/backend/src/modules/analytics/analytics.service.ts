import { AnalyticsGrowthBucket } from "~/libs/enums/enums.js";
import { roundScore } from "~/libs/helpers/helpers.js";
import {
	type AnalyticsDistributionResponseDto,
	type AnalyticsGrowthResponseDto,
	type AnalyticsKeywordResponseDto,
	type AnalyticsSummaryResponseDto,
	ValueOf,
} from "~/libs/types/types.js";

import { AnalyticsRepository } from "./analytics.repository.js";
import { fillGrowthGaps } from "./libs/helpers/fill-growth-gaps.helper.js";
import { getDistributionPercentages } from "./libs/helpers/get-distribution-percentages.helper.js";
import { getWeeklyChange } from "./libs/helpers/get-weekly-change.helper.js";
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
		const counts = await this.analyticsRepository.findDistribution({
			userId,
			workspaceId,
		});

		const percentages = getDistributionPercentages(counts);

		return {
			high: {
				count: counts.high,
				percentage: percentages.high,
			},
			low: {
				count: counts.low,
				percentage: percentages.low,
			},
			mid: {
				count: counts.mid,
				percentage: percentages.mid,
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
