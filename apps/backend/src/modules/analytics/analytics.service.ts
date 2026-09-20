import { AnalyticsGrowthBucket } from "~/libs/enums/enums.js";
import {
	type AnalyticsDistributionResponseDto,
	type AnalyticsGrowthResponseDto,
	type AnalyticsKeywordResponseDto,
	ValueOf,
} from "~/libs/types/types.js";

import { AnalyticsRepository } from "./analytics.repository.js";
import { countPercentage } from "./libs/helpers/count-percentage.js";
import { fillGrowthGaps } from "./libs/helpers/fill-growth-gaps.helper.js";
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

		return { points: fillGrowthGaps(rows, granularity) };
	}

	public async findKeywordWeights({
		userId,
		workspaceId,
	}: AnalyticsScopeQuery): Promise<AnalyticsKeywordResponseDto> {
		const items = await this.analyticsRepository.findKeywordWeights({
			userId,
			workspaceId,
		});

		return { items };
	}
}

export { AnalyticsService };
