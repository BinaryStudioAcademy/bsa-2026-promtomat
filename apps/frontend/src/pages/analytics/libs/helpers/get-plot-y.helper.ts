import { GrowthChartConfig } from "../constants/constants.js";
import { type PlotBounds, type YAxis } from "../types/types.js";

const getPlotY = (
	value: number,
	axis: YAxis,
	{ plotBottom }: PlotBounds,
): number => {
	const plotHeight = plotBottom - GrowthChartConfig.PADDING_TOP;
	const ratio = (value - axis.min) / (axis.max - axis.min);

	return plotBottom - ratio * plotHeight;
};

export { getPlotY };
