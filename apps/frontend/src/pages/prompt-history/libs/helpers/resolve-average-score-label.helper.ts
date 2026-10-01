import { AnalyticLabel } from "~/pages/analytics/libs/enums/enums.js";

const FRACTION_DIGITS = 1;

const resolveAverageScoreLabel = (averageScore: null | number): string => {
	if (averageScore === null) {
		return "—";
	}

	return `${String(+averageScore.toFixed(FRACTION_DIGITS))} ${AnalyticLabel.KPI_AVERAGE_CAPTION}`;
};

export { resolveAverageScoreLabel };
