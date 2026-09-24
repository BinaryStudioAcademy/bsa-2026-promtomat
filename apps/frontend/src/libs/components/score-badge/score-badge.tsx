import React from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";

import { getScoreVariant } from "./libs/helpers/get-score-variant.helper.js";
import styles from "./styles.module.css";

type Properties = {
	efficiencyScore: number;
	isFill?: boolean;
	label?: string;
};

const ScoreBadge: React.FC<Properties> = ({
	efficiencyScore,
	isFill = true,
	label,
}) => {
	return (
		<span
			className={getValidClasses(
				styles["badge"],
				styles[getScoreVariant(efficiencyScore)],
				isFill && styles["filled"],
			)}
		>
			{label ?? efficiencyScore}
		</span>
	);
};

export { ScoreBadge };
