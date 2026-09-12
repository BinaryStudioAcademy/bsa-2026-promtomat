import { EMPTY_LENGTH } from "~/libs/constants/constants.js";

import { PERCENTAGE_SCALE } from "../constants/constants.js";

const getProgressPercentage = (count: number, target: number): number => {
	if (target <= EMPTY_LENGTH) {
		return EMPTY_LENGTH;
	}

	return Math.min(PERCENTAGE_SCALE, (count / target) * PERCENTAGE_SCALE);
};

export { getProgressPercentage };
