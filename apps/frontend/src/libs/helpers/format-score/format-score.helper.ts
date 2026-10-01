import {
	EMPTY_METRIC_VALUE,
	SCORE_FRACTION_DIGITS,
} from "~/libs/constants/constants.js";

const formatScore = (score: null | number | undefined): string => {
	return score === null || score === undefined
		? EMPTY_METRIC_VALUE
		: score.toFixed(SCORE_FRACTION_DIGITS);
};

export { formatScore };
