import { ScoreThreshold } from "../enums/enums.js";

function getScoreColor(score: null | number) {
	if (!score) {
		return "";
	}
	if (score <= ScoreThreshold.DANGER_MAX) {
		return "danger";
	}
	if (score <= ScoreThreshold.WARNING_MAX) {
		return "warning";
	}
	return "success";
}

export { getScoreColor };
