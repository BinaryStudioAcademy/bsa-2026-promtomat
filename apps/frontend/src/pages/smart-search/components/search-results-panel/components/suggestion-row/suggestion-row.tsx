import React from "react";
import { Link } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { configureString, getValidClasses } from "~/libs/helpers/helpers.js";

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
			to={configureString(AppRoute.PROMPTS_$PROMPT_ID, {
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
