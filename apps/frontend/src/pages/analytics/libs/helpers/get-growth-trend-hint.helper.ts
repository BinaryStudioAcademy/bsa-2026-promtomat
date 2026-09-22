import { type AnalyticsGranularity } from "~/modules/analytics/libs/types/types.js";

import { AnalyticLabel, GrowthUnits } from "../enums/enums.js";

const getGrowthTrendHint = (granularity: AnalyticsGranularity): string => {
	const { plural } = GrowthUnits[granularity];

	return `${AnalyticLabel.GROWTH_TREND_HINT_PREFIX} ${plural} ${AnalyticLabel.GROWTH_TREND_HINT_SUFFIX}`;
};

export { getGrowthTrendHint };
