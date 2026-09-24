import { ScoreThreshold } from "./score-threshold.enum.js";

const SCORE_STEP = 1;

const ScoreTierMin = {
	HIGH: ScoreThreshold.WARNING_MAX + SCORE_STEP,
	MID: ScoreThreshold.DANGER_MAX + SCORE_STEP,
} as const;

export { ScoreTierMin };
