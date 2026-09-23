import { type AnalyticsGrowthPoint } from "~/modules/analytics/libs/types/types.js";

import { LAST_ELEMENT_INDEX } from "../constants/constants.js";
import {
	type ChartPoint,
	type PlotBounds,
	type YAxis,
} from "../types/types.js";
import { getPlotX } from "./get-plot-x.helper.js";
import { getPlotY } from "./get-plot-y.helper.js";

const splitIntoSeries = (
	points: AnalyticsGrowthPoint[],
	axis: YAxis,
	bounds: PlotBounds,
): ChartPoint[][] => {
	const series: ChartPoint[][] = [];
	let isSeriesBroken = true;

	for (const [index, point] of points.entries()) {
		if (point.averageScore === null) {
			isSeriesBroken = true;
		} else {
			const chartPoint = {
				date: point.date,
				x: getPlotX(index, points.length, bounds),
				y: getPlotY(point.averageScore, axis, bounds),
			};

			if (isSeriesBroken) {
				series.push([chartPoint]);
			} else {
				series.at(LAST_ELEMENT_INDEX)?.push(chartPoint);
			}

			isSeriesBroken = false;
		}
	}

	return series;
};

export { splitIntoSeries };
