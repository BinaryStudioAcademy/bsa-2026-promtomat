const FRACTION_DIGITS = 1;

const formatScore = (score: null | number | undefined): null | number => {
	if (score === null || score === undefined) {
		return null;
	}

	return +score.toFixed(FRACTION_DIGITS);
};

export { formatScore };
