import React from "react";

import { PromptValidationRule } from "~/modules/prompts/prompts.js";

import { PromptDeliveryViewLabel } from "../../enums/enums.js";
import { formatScore } from "../../helpers/helpers.js";
import styles from "./styles.module.css";

type Properties = {
	computedScore: null | number;
	efficiencyScore?: number | undefined;
	workspaceName?: string | undefined;
};

const PromptMetaSection: React.FC<Properties> = ({
	computedScore,
	efficiencyScore,
	workspaceName,
}: Properties) => {
	const rawScore = computedScore ?? efficiencyScore;
	const formattedScore = formatScore(rawScore);

	const hasMeta =
		formattedScore !== null || computedScore === null || Boolean(workspaceName);

	if (!hasMeta) {
		return null;
	}

	return (
		<div className={styles["meta-row"]}>
			{formattedScore === null ? (
				<span className={styles["badge"]}>Unrated</span>
			) : (
				<span className={styles["badge"]}>
					{`${PromptDeliveryViewLabel.SCORE} ${String(formattedScore)} / ${String(PromptValidationRule.EFFICIENCY_SCORE_MAX)}`}
				</span>
			)}
			{workspaceName && (
				<span className={styles["badge"]}>{workspaceName}</span>
			)}
		</div>
	);
};

export { PromptMetaSection };
