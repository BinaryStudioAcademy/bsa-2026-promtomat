import { roundScore } from "~/libs/helpers/helpers.js";
import { type AnalyticsWeeklyChange } from "~/libs/types/types.js";

import { type PromptWeeklyChangeRow } from "../types/types.js";

const getWeeklyChange = ({
	currentScore,
	previousScore,
}: PromptWeeklyChangeRow): AnalyticsWeeklyChange => {
	if (currentScore === null || previousScore === null) {
		return { change: null, previousScore: null };
	}

	return {
		change: roundScore(currentScore - previousScore),
		previousScore: roundScore(previousScore),
	};
};

export { getWeeklyChange };
