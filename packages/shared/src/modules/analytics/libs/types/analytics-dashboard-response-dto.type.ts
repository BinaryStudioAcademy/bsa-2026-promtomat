import { type AnalyticsDistributionResponseDto } from "./analytics-distribution-response-dto.type.js";
import { type AnalyticsGrowthResponseDto } from "./analytics-growth-response-dto.type.js";
import { type AnalyticsKeywordResponseDto } from "./analytics-keyword-response-dto.type.js";
import { type AnalyticsSummaryResponseDto } from "./analytics-summary-response-dto.type.js";

type AnalyticsDashboardResponseDto = {
	distribution: AnalyticsDistributionResponseDto;
	growth: AnalyticsGrowthResponseDto;
	keywords: AnalyticsKeywordResponseDto;
	summary: AnalyticsSummaryResponseDto;
};

export { type AnalyticsDashboardResponseDto };
