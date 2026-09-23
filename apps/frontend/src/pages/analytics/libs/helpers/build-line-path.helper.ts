import { FIRST_ELEMENT_INDEX } from "~/libs/constants/constants.js";

import { GrowthChartConfig } from "../enums/enums.js";
import { type ChartPoint } from "../types/types.js";

const buildLinePath = (series: ChartPoint[]): string => {
	return series
		.map(({ x, y }, index) => {
			const command = index === FIRST_ELEMENT_INDEX ? "M" : "L";

			return `${command} ${x.toFixed(GrowthChartConfig.PATH_PRECISION)} ${y.toFixed(GrowthChartConfig.PATH_PRECISION)}`;
		})
		.join(" ");
};

export { buildLinePath };
