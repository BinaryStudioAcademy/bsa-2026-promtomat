import { ZERO_VALUE } from "~/libs/constants/constants.js";

import { SCORE_FRACTION_DIGITS } from "../constants/constants.js";
import { AnalyticLabel, MetricTone } from "../enums/enums.js";
import { type ScoreChange, type ScoreDelta } from "../types/types.js";

const formatScoreChange = ({
	change,
	previousScore,
}: ScoreDelta): ScoreChange => {
	if (change === null || previousScore === null) {
		return {
			caption: "",
			tone: MetricTone.NEUTRAL,
			value: AnalyticLabel.EMPTY_VALUE,
		};
	}

	const caption = `${AnalyticLabel.KPI_CHANGE_CAPTION_PREFIX} ${previousScore.toFixed(SCORE_FRACTION_DIGITS)}`;

	if (change > ZERO_VALUE) {
		return {
			caption,
			tone: MetricTone.SUCCESS,
			value: `+${change.toFixed(SCORE_FRACTION_DIGITS)}`,
		};
	}

	return {
		caption,
		tone: change < ZERO_VALUE ? MetricTone.DANGER : MetricTone.NEUTRAL,
		value: change.toFixed(SCORE_FRACTION_DIGITS),
	};
};

export { formatScoreChange };
