import { type AnalyticsDistributionResponseDto } from "./analytics-distribution-response-dto.type.js";
import { type AnalyticsGrowthResponseDto } from "./analytics-growth-response-dto.type.js";
import { type AnalyticsKeywordResponseDto } from "./analytics-keyword-response-dto.type.js";

type AnalyticsDashboardResponseDto = {
	distribution: AnalyticsDistributionResponseDto;
	growth: AnalyticsGrowthResponseDto;
	keywords: AnalyticsKeywordResponseDto;
};

export { type AnalyticsDashboardResponseDto };
