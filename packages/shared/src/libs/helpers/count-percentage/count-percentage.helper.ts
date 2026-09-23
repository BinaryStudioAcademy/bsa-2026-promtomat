import {
	PERCENTAGE_MULTIPLIER,
	ROUND_FACTOR,
	ZERO_VALUE,
} from "../../constants/constants.js";

const countPercentage = (count: number, total: number): number => {
	if (total === ZERO_VALUE) {
		return ZERO_VALUE;
	}

	return (
		Math.round((count / total) * PERCENTAGE_MULTIPLIER * ROUND_FACTOR) /
		ROUND_FACTOR
	);
};

export { countPercentage };
