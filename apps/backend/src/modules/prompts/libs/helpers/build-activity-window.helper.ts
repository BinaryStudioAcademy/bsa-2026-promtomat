import { SINGLE_DAY, ZERO_VALUE } from "~/libs/constants/constants.js";

import { PromptProgress } from "../enums/enums.js";
import { type PromptStreakDayDto } from "../types/types.js";
import { getPreviousDate } from "./get-previous-date.helper.js";

const buildActivityWindow = (
	activeDays: PromptStreakDayDto[],
	today: string,
): PromptStreakDayDto[] => {
	const countByDate = new Map(
		activeDays.map(({ date, promptCount }) => [date, promptCount]),
	);

	const days: PromptStreakDayDto[] = [];

	let cursor = today;

	for (
		let index = ZERO_VALUE;
		index < PromptProgress.ACTIVITY_WINDOW;
		index += SINGLE_DAY
	) {
		days.unshift({
			date: cursor,
			promptCount: countByDate.get(cursor) ?? ZERO_VALUE,
		});
		cursor = getPreviousDate(cursor);
	}

	return days;
};

export { buildActivityWindow };
