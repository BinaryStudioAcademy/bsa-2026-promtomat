import { ScoreThreshold } from "~/libs/components/score-grid/libs/enums/enums.js";

const getScoreVariant = (score: number): "danger" | "success" | "warning" => {
	if (score <= ScoreThreshold.DANGER_MAX) {
		return "danger";
	}
	if (score <= ScoreThreshold.WARNING_MAX) {
		return "warning";
	}
	return "success";
};

export { getScoreVariant };
