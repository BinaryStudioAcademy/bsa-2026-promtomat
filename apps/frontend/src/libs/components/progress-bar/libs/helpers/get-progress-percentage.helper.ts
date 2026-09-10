import { EMPTY_TARGET, PERCENTAGE_SCALE } from "../constants/constants.js";

const getProgressPercentage = (count: number, target: number): number => {
	if (target <= EMPTY_TARGET) {
		return EMPTY_TARGET;
	}

	return Math.min(PERCENTAGE_SCALE, (count / target) * PERCENTAGE_SCALE);
};

export { getProgressPercentage };
