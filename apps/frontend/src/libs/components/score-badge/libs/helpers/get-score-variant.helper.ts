import { ScoreTierMin } from "~/libs/enums/enums.js";

import { BadgeVariant } from "../enums/badge-variant.enum.js";
import { type ScoreVariant } from "../types/types.js";

const getScoreVariant = (score: number): ScoreVariant => {
	if (score >= ScoreTierMin.HIGH) {
		return BadgeVariant.SUCCESS;
	}
	if (score >= ScoreTierMin.MID) {
		return BadgeVariant.WARNING;
	}
	return BadgeVariant.DANGER;
};

export { getScoreVariant };
