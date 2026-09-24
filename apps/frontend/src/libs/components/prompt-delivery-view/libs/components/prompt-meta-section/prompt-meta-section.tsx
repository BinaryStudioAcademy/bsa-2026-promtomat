import React from "react";

import { PromptValidationRule } from "~/modules/prompts/prompts.js";

import { PromptDeliveryViewLabel } from "../../enums/enums.js";
import styles from "./styles.module.css";

const FRACTION_DIGITS = 1;

type Properties = {
	computedScore: null | number;
	efficiencyScore?: number | undefined;
	workspaceName?: string | undefined;
};

const formatScore = (score: null | number | undefined): null | number => {
	if (score === null || score === undefined) {
		return null;
	}

	const numericValue = typeof score === "string" ? Number(score) : score;

	return +numericValue.toFixed(FRACTION_DIGITS);
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
