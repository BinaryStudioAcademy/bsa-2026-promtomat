import { type ValueOf } from "~/libs/types/types.js";

import { ProgressFillTone, ProgressThreshold } from "../enums/enums.js";

const getProgressFillTone = (
	percentage: number,
): ValueOf<typeof ProgressFillTone> => {
	if (percentage >= ProgressThreshold.HIGH) {
		return ProgressFillTone.HIGH;
	}

	if (percentage >= ProgressThreshold.MEDIUM) {
		return ProgressFillTone.MEDIUM;
	}

	return ProgressFillTone.LOW;
};

export { getProgressFillTone };
