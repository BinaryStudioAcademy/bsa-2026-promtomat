import { ScoreBadgeLabel } from "../enums/score-badge-label.enum.js";

type Parameters = {
	efficiencyScore: null | number;
	label?: string | undefined;
	maxScore?: number | undefined;
};

const getScoreBadgeContent = ({
	efficiencyScore,
	label,
	maxScore,
}: Parameters): string => {
	if (efficiencyScore === null) {
		return ScoreBadgeLabel.UNRATED;
	}

	if (label !== undefined) {
		return label;
	}

	if (maxScore !== undefined) {
		return `${String(efficiencyScore)}/${String(maxScore)}`;
	}

	return String(efficiencyScore);
};

export { getScoreBadgeContent };
