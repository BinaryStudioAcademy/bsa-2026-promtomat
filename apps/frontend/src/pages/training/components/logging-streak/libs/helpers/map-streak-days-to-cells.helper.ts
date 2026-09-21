import { EMPTY_LENGTH } from "~/libs/constants/constants.js";

import { type StreakCell, type StreakDay } from "../types/types.js";
import { getStreakDayIntensity } from "./get-streak-day-intensity.helper.js";
import { getStreakDayLabel } from "./get-streak-day-label.helper.js";
import { getTooltipAlignment } from "./get-tooltip-alignment.helper.js";

const mapStreakDaysToCells = (days: StreakDay[]): StreakCell[] => {
	const maxLogCount = Math.max(
		EMPTY_LENGTH,
		...days.map((day) => day.logCount),
	);

	return days.map((day, index) => {
		return {
			alignment: getTooltipAlignment(index, days.length),
			id: day.id,
			intensity: getStreakDayIntensity(day.logCount, maxLogCount),
			label: getStreakDayLabel(day),
		};
	});
};

export { mapStreakDaysToCells };
