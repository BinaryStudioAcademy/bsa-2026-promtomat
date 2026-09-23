import { SCORE_FRACTION_DIGITS } from "../constants/constants.js";
import { AnalyticLabel } from "../enums/enums.js";

const formatScore = (score: null | number): string => {
	return score === null
		? AnalyticLabel.EMPTY_VALUE
		: score.toFixed(SCORE_FRACTION_DIGITS);
};

export { formatScore };
