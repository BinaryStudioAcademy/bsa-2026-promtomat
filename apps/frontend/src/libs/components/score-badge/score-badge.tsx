import React from "react";

import { getScoreVariant, getValidClasses } from "~/libs/helpers/helpers.js";

import { getScoreBadgeContent } from "./libs/helpers/get-score-badge-content.helper.js";
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
	const content = getScoreBadgeContent({ efficiencyScore, label, maxScore });

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
