import { ButtonVariant } from "~/libs/enums/button-variant.enum.js";
import { ValueOf } from "~/libs/types/types.js";

import { ScoreThreshold } from "../enums/enums.js";

const getScoreColor = (score: number): ValueOf<typeof ButtonVariant> => {
	if (score <= ScoreThreshold.DANGER_MAX) {
		return ButtonVariant.DANGER_OUTLINE;
	}
	if (score <= ScoreThreshold.WARNING_MAX) {
		return ButtonVariant.WARNING_OUTLINE;
	}
	return ButtonVariant.SUCCESS_OUTLINE;
};

export { getScoreColor };
