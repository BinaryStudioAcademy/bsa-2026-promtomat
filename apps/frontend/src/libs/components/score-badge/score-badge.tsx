import React from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";

import { getScoreVariant } from "./libs/helpers/get-score-variant.helper.js";
import styles from "./styles.module.css";

type Properties = {
	className?: string | undefined;
	efficiencyScore: number;
	isFill?: boolean;
	label?: string;
};

const ScoreBadge: React.FC<Properties> = ({
	className,
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
				className,
			)}
		>
			{label ?? efficiencyScore}
		</span>
	);
};

export { ScoreBadge };
