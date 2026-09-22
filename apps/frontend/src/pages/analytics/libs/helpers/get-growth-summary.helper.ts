import { FIRST_ELEMENT_INDEX, ZERO_VALUE } from "~/libs/constants/constants.js";
import { type AnalyticsGrowthPoint } from "~/modules/analytics/libs/types/types.js";

import {
	GrowthChartConfig,
	LAST_ELEMENT_INDEX,
} from "../constants/constants.js";
import { type GrowthSummary } from "../types/types.js";

const hasContiguousTrend = (points: AnalyticsGrowthPoint[]): boolean => {
	let runLength = ZERO_VALUE;

	for (const point of points) {
		runLength =
			point.averageScore === null
				? ZERO_VALUE
				: runLength + GrowthChartConfig.INDEX_OFFSET;

		if (runLength >= GrowthChartConfig.MIN_TREND_POINTS) {
			return true;
		}
	}

	return false;
};

const getGrowthSummary = (points: AnalyticsGrowthPoint[]): GrowthSummary => {
	const scores = points.flatMap(({ averageScore }) =>
		averageScore === null ? [] : [averageScore],
	);

	return {
		first: scores.at(FIRST_ELEMENT_INDEX) ?? null,
		hasData: scores.length >= GrowthChartConfig.MIN_SCORED_POINTS,
		hasTrend: hasContiguousTrend(points),
		latest: scores.at(LAST_ELEMENT_INDEX) ?? null,
		scores,
	};
};

export { getGrowthSummary };
