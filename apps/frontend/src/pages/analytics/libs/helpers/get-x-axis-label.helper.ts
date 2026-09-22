import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { type AnalyticsGranularity } from "~/modules/analytics/libs/types/types.js";

import { GrowthChartConfig, GrowthUnits } from "../enums/enums.js";

const getXAxisLabel = (
	index: number,
	count: number,
	granularity: AnalyticsGranularity,
): string => {
	const offset = count - GrowthChartConfig.INDEX_OFFSET - index;
	const { current, suffix } = GrowthUnits[granularity];

	return offset === ZERO_VALUE ? current : `${String(offset)}${suffix}`;
};

export { getXAxisLabel };
