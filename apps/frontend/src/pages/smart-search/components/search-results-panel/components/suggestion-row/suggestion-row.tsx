import React from "react";
import { Link } from "react-router-dom";

import { ScoreBadge } from "~/libs/components/score-badge/score-badge.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";

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
			<ScoreBadge efficiencyScore={efficiencyScore} />
		</Link>
	);
};

export { SuggestionRow };
