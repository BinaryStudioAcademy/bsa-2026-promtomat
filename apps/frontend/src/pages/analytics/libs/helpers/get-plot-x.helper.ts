import { ZERO_VALUE } from "~/libs/constants/constants.js";

import { GrowthChartConfig } from "../constants/constants.js";
import { type PlotBounds } from "../types/types.js";

const getPlotX = (
	index: number,
	count: number,
	{ plotRight }: PlotBounds,
): number => {
	const plotWidth = plotRight - GrowthChartConfig.PADDING_LEFT;
	const lastIndex = count - GrowthChartConfig.INDEX_OFFSET;

	if (lastIndex <= ZERO_VALUE) {
		return GrowthChartConfig.PADDING_LEFT;
	}

	return GrowthChartConfig.PADDING_LEFT + (index * plotWidth) / lastIndex;
};

export { getPlotX };
