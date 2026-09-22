import { type AnalyticsGranularity } from "~/modules/analytics/libs/types/types.js";

import { GROWTH_UNITS } from "../constants/constants.js";
import { AnalyticLabel } from "../enums/enums.js";

const getGrowthTrendHint = (granularity: AnalyticsGranularity): string => {
	const { plural } = GROWTH_UNITS[granularity];

	return `${AnalyticLabel.GROWTH_TREND_HINT_PREFIX} ${plural} ${AnalyticLabel.GROWTH_TREND_HINT_SUFFIX}`;
};

export { getGrowthTrendHint };
