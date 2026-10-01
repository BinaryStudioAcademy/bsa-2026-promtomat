import { ScoreTierMin, ScoreVariant } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

const getScoreVariant = (
	score: null | number,
): ValueOf<typeof ScoreVariant> => {
	if (score === null) {
		return ScoreVariant.NEUTRAL;
	}
	if (score >= ScoreTierMin.HIGH) {
		return ScoreVariant.SUCCESS;
	}
	if (score >= ScoreTierMin.MID) {
		return ScoreVariant.WARNING;
	}
	return ScoreVariant.DANGER;
};

export { getScoreVariant };
