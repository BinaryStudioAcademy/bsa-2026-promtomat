import { FIRST_ELEMENT_INDEX } from "~/libs/constants/constants.js";

import { LAST_ELEMENT_INDEX } from "../constants/constants.js";
import { GrowthChartConfig } from "../enums/enums.js";
import { type ChartPoint } from "../types/types.js";
import { buildLinePath } from "./build-line-path.helper.js";

const buildAreaPath = (series: ChartPoint[], plotBottom: number): string => {
	const first = series.at(FIRST_ELEMENT_INDEX);
	const last = series.at(LAST_ELEMENT_INDEX);

	if (!first || !last) {
		return "";
	}

	const lastX = last.x.toFixed(GrowthChartConfig.PATH_PRECISION);
	const firstX = first.x.toFixed(GrowthChartConfig.PATH_PRECISION);

	return `${buildLinePath(series)} L ${lastX} ${String(plotBottom)} L ${firstX} ${String(plotBottom)} Z`;
};

export { buildAreaPath };
