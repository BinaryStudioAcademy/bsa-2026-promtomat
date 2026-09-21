import React from "react";

import { PromptValidationRule } from "~/modules/prompts/prompts.js";

import { PromptDeliveryViewLabel } from "../../enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	efficiencyScore: number | undefined;
	workspaceName: string | undefined;
};

const PromptMetaSection: React.FC<Properties> = ({
	efficiencyScore,
	workspaceName,
}: Properties) => {
	const hasMeta = efficiencyScore !== undefined || Boolean(workspaceName);

	if (!hasMeta) {
		return null;
	}

	return (
		<div className={styles["meta-row"]}>
			{efficiencyScore !== undefined && (
				<span className={styles["badge"]}>
					{`${PromptDeliveryViewLabel.SCORE} ${String(efficiencyScore)} / ${String(PromptValidationRule.EFFICIENCY_SCORE_MAX)}`}
				</span>
			)}
			{workspaceName && (
				<span className={styles["badge"]}>{workspaceName}</span>
			)}
		</div>
	);
};

export { PromptMetaSection };
