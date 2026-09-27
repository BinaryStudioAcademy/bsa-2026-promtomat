import React from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";

import { ScoreBadgeLabel } from "./libs/enums/score-badge-label.enum.js";
import { getScoreVariant } from "./libs/helpers/get-score-variant.helper.js";
import styles from "./styles.module.css";

type Properties = {
	className?: string | undefined;
	efficiencyScore: null | number;
	isFill?: boolean;
	label?: string;
	maxScore?: number;
};

const ScoreBadge: React.FC<Properties> = ({
	className,
	efficiencyScore,
	isFill = true,
	label,
	maxScore,
}) => {
	let content: React.ReactNode = efficiencyScore;

	if (efficiencyScore === null) {
		content = ScoreBadgeLabel.UNRATED;
	} else if (label !== undefined) {
		content = label;
	} else if (maxScore !== undefined) {
		content = `${String(efficiencyScore)}/${String(maxScore)}`;
	}

	return (
		<span
			className={getValidClasses(
				styles["badge"],
				styles[getScoreVariant(efficiencyScore)],
				isFill && styles["filled"],
				className,
			)}
		>
			{content}
		</span>
	);
};

export { ScoreBadge };
