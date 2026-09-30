const FRACTION_DIGITS = 1;
const EMPTY_SCORE = "-";

const formatScore = (score: null | number | undefined): string => {
	return score === null || score === undefined
		? EMPTY_SCORE
		: score.toFixed(FRACTION_DIGITS);
};

export { formatScore };
