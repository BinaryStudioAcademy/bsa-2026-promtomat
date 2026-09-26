import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { type PromptStreakDayDto } from "~/modules/prompts/libs/types/types.js";

import { type StreakCell } from "../types/types.js";
import { getStreakDayIntensity } from "./get-streak-day-intensity.helper.js";
import { getStreakDayLabel } from "./get-streak-day-label.helper.js";
import { getTooltipAlignment } from "./get-tooltip-alignment.helper.js";

const mapStreakDaysToCells = (days: PromptStreakDayDto[]): StreakCell[] => {
	const maxPromptCount = Math.max(
		EMPTY_LENGTH,
		...days.map((day) => day.promptCount),
	);

	return days.map((day, index) => {
		return {
			alignment: getTooltipAlignment(index, days.length),
			date: day.date,
			intensity: getStreakDayIntensity(day.promptCount, maxPromptCount),
			label: getStreakDayLabel(day),
		};
	});
};

export { mapStreakDaysToCells };
