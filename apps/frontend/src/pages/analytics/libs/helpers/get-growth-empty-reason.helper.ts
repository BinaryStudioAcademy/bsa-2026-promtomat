import { type AnalyticsGranularity } from "~/modules/analytics/libs/types/types.js";

import { AnalyticLabel, GrowthUnits } from "../enums/enums.js";

const getGrowthEmptyReason = (
	count: number,
	granularity: AnalyticsGranularity,
): string => {
	const { plural } = GrowthUnits[granularity];

	return `${AnalyticLabel.GROWTH_EMPTY_REASON} ${String(count)} ${plural}`;
};

export { getGrowthEmptyReason };
