import React from "react";

import { ScoreBadge } from "~/libs/components/score-badge/score-badge.js";
import { PromptValidationRule } from "~/modules/prompts/prompts.js";

import styles from "./styles.module.css";

type Properties = {
	computedScore?: null | number | undefined;
	efficiencyScore?: null | number | undefined;
	workspaceName?: string | undefined;
};

const PromptMetaSection: React.FC<Properties> = ({
	computedScore,
	efficiencyScore,
	workspaceName,
}: Properties) => {
	const score = computedScore ?? efficiencyScore;
	const hasMeta = score !== undefined || Boolean(workspaceName);

	if (!hasMeta) {
		return null;
	}

	return (
		<div className={styles["meta-row"]}>
			{score !== undefined && (
				<ScoreBadge
					efficiencyScore={score}
					maxScore={PromptValidationRule.EFFICIENCY_SCORE_MAX}
				/>
			)}
			{workspaceName && (
				<span className={styles["badge"]}>{workspaceName}</span>
			)}
		</div>
	);
};

export { PromptMetaSection };
