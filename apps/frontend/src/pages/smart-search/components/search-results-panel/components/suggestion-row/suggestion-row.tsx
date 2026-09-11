import React from "react";
import { generatePath, Link } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";

import { getScoreVariant } from "./libs/helpers/get-score-variant.helper.js";
import styles from "./styles.module.css";

type Properties = {
	efficiencyScore: number;
	promptId: number;
	taskIntent: string;
};

const SuggestionRow: React.FC<Properties> = ({
	efficiencyScore,
	promptId,
	taskIntent,
}) => {
	return (
		<Link
			className={styles["row"]}
			to={generatePath(AppRoute.PROMPT_DETAILS, {
				promptId: String(promptId),
			})}
		>
			<span className={styles["title"]}>{taskIntent}</span>
			<span
				className={getValidClasses(
					styles["badge"],
					styles[getScoreVariant(efficiencyScore)],
				)}
			>
				{efficiencyScore}
			</span>
		</Link>
	);
};

export { SuggestionRow };
