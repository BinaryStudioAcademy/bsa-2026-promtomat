import { SCORE_THRESHOLD } from "../enums/enums.js";

function getScoreColor(score: null | number) {
	if (!score) {
		return "";
	}
	if (score <= SCORE_THRESHOLD.DANGER_MAX) {
		return "danger";
	}
	if (score <= SCORE_THRESHOLD.WARNING_MAX) {
		return "warning";
	}
	return "success";
}

export { getScoreColor };
