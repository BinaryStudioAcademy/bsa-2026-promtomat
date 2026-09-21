import { EMPTY_LENGTH } from "~/libs/constants/constants.js";

import {
	MINIMUM_ACTIVE_INTENSITY,
	NO_INTENSITY,
} from "../constants/constants.js";

const getStreakDayIntensity = (
	logCount: number,
	maxLogCount: number,
): number => {
	if (logCount === EMPTY_LENGTH || maxLogCount === EMPTY_LENGTH) {
		return NO_INTENSITY;
	}

	return Math.max(MINIMUM_ACTIVE_INTENSITY, logCount / maxLogCount);
};

export { getStreakDayIntensity };
