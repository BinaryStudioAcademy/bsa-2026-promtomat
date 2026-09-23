import { ScoreTierMin } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { BadgeVariant } from "../enums/badge-variant.enum.js";

const getScoreVariant = (score: number): ValueOf<typeof BadgeVariant> => {
	if (score >= ScoreTierMin.HIGH) {
		return BadgeVariant.SUCCESS;
	}
	if (score >= ScoreTierMin.MID) {
		return BadgeVariant.WARNING;
	}
	return BadgeVariant.DANGER;
};

export { getScoreVariant };
