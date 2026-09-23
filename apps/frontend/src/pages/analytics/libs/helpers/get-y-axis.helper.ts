import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { PromptValidationRule } from "~/modules/prompts/prompts.js";

import { AXIS_STEPS } from "../constants/constants.js";
import { GrowthChartConfig } from "../enums/enums.js";
import { type YAxis } from "../types/types.js";

const roundAxisValue = (value: number): number => {
	return Number(value.toFixed(GrowthChartConfig.AXIS_PRECISION));
};

const getYAxis = (scores: number[]): YAxis => {
	const dataMin = Math.min(...scores);
	const dataMax = Math.max(...scores);
	const padding =
		dataMin === dataMax ? GrowthChartConfig.FLAT_RANGE_PADDING : ZERO_VALUE;
	const rangeMin = dataMin - padding;
	const rangeMax = dataMax + padding;

	const step =
		AXIS_STEPS.find((candidate) => {
			const intervals =
				Math.ceil(rangeMax / candidate) - Math.floor(rangeMin / candidate);

			return intervals <= GrowthChartConfig.MAX_AXIS_INTERVALS;
		}) ?? GrowthChartConfig.FALLBACK_AXIS_STEP;

	const min = Math.max(
		roundAxisValue(Math.floor(rangeMin / step) * step),
		ZERO_VALUE,
	);
	const max = Math.min(
		roundAxisValue(Math.ceil(rangeMax / step) * step),
		PromptValidationRule.EFFICIENCY_SCORE_MAX,
	);
	const tickCount =
		Math.round((max - min) / step) + GrowthChartConfig.TICK_COUNT_OFFSET;
	const ticks = Array.from({ length: tickCount }, (_, index) =>
		roundAxisValue(min + index * step),
	);

	return { max, min, ticks };
};

export { getYAxis };
