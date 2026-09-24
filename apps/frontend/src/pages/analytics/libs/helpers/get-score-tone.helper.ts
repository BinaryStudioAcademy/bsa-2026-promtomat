import { ScoreTierMin } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { ScoreTone } from "../enums/enums.js";

const getScoreTone = (score: number): ValueOf<typeof ScoreTone> => {
	if (score >= ScoreTierMin.HIGH) {
		return ScoreTone.SUCCESS;
	}

	if (score >= ScoreTierMin.MID) {
		return ScoreTone.WARNING;
	}

	return ScoreTone.DANGER;
};

export { getScoreTone };
