import { ZERO_VALUE } from "~/libs/constants/constants.js";

import { SINGLE_DAY } from "../constants/constants.js";
import { type PromptStreakDayDto } from "../types/types.js";
import { getPreviousDate } from "./get-previous-date.helper.js";

const countCurrentStreak = (
	activeDays: PromptStreakDayDto[],
	today: string,
): number => {
	const activeDates = new Set(activeDays.map(({ date }) => date));

	let cursor = activeDates.has(today) ? today : getPreviousDate(today);
	let streak = ZERO_VALUE;

	while (activeDates.has(cursor)) {
		streak += SINGLE_DAY;
		cursor = getPreviousDate(cursor);
	}

	return streak;
};

export { countCurrentStreak };
