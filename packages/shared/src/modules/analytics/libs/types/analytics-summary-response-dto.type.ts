import { type AnalyticsWeeklyChange } from "./analytics-weekly-change.type.js";

type AnalyticsSummaryResponseDto = {
	averageScore: null | number;
	keywordCount: number;
	weeklyChange: AnalyticsWeeklyChange;
};

export { type AnalyticsSummaryResponseDto };
