import { type AnalyticsGranularity } from "~/modules/analytics/libs/types/types.js";

import { AnalyticLabel, GrowthUnits } from "../enums/enums.js";
import { type GrowthSummary } from "../types/types.js";
import { formatScore } from "./format-score.helper.js";

const getGrowthDescription = (
	summary: GrowthSummary,
	count: number,
	granularity: AnalyticsGranularity,
): string => {
	if (!summary.hasTrend) {
		const latestScore = summary.latest ?? summary.first;

		return `${AnalyticLabel.GROWTH_DESCRIPTION_NO_TREND} ${formatScore(latestScore)}`;
	}

	const from = formatScore(summary.first);
	const to = formatScore(summary.latest);
	const { plural } = GrowthUnits[granularity];

	return `${AnalyticLabel.GROWTH_DESCRIPTION_FROM} ${from} ${AnalyticLabel.GROWTH_DESCRIPTION_TO} ${to} ${AnalyticLabel.GROWTH_DESCRIPTION_OVER} ${String(count)} ${plural}`;
};

export { getGrowthDescription };
