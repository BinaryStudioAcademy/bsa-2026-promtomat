import { type AnalyticsGranularity } from "~/modules/analytics/libs/types/types.js";

import { GROWTH_UNITS } from "../constants/constants.js";
import { AnalyticLabel } from "../enums/enums.js";

const getGrowthEmptyReason = (
	count: number,
	granularity: AnalyticsGranularity,
): string => {
	const { plural } = GROWTH_UNITS[granularity];

	return `${AnalyticLabel.GROWTH_EMPTY_REASON} ${String(count)} ${plural}`;
};

export { getGrowthEmptyReason };
