import { ScoreThreshold } from "~/libs/enums/enums.js";

import { BadgeVariant } from "../enums/badge-variant.enum.js";
import { type ScoreVariant } from "../types/types.js";

const getScoreVariant = (score: number): ScoreVariant => {
	if (score <= ScoreThreshold.DANGER_MAX) {
		return BadgeVariant.DANGER;
	}
	if (score <= ScoreThreshold.WARNING_MAX) {
		return BadgeVariant.WARNING;
	}
	return BadgeVariant.SUCCESS;
};

export { getScoreVariant };
