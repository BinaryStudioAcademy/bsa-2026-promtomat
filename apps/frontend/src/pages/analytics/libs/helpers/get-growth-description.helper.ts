import { type AnalyticsGranularity } from "~/modules/analytics/libs/types/types.js";

import { GROWTH_UNITS } from "../constants/constants.js";
import { AnalyticLabel } from "../enums/enums.js";
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
	const { plural } = GROWTH_UNITS[granularity];

	return `${AnalyticLabel.GROWTH_DESCRIPTION_FROM} ${from} ${AnalyticLabel.GROWTH_DESCRIPTION_TO} ${to} ${AnalyticLabel.GROWTH_DESCRIPTION_OVER} ${String(count)} ${plural}`;
};

export { getGrowthDescription };
