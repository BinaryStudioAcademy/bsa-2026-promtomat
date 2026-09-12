import { ScoreThreshold } from "~/libs/components/score-grid/libs/enums/enums.js";

import { type ScoreVariant } from "../types/types.js";

const getScoreVariant = (score: number): ScoreVariant => {
	if (score <= ScoreThreshold.DANGER_MAX) {
		return "danger";
	}
	if (score <= ScoreThreshold.WARNING_MAX) {
		return "warning";
	}
	return "success";
};

export { getScoreVariant };
