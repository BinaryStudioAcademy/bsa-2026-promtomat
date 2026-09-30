import React from "react";

import { getProgressPercentage } from "~/libs/components/progress-bar/libs/helpers/helpers.js";
import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { Locale } from "~/libs/enums/enums.js";
import { PromptProgress } from "~/modules/prompts/prompts.js";

import { DatasetTargetMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	promptCount: number;
};

const DatasetTarget: React.FC<Properties> = ({ promptCount }: Properties) => {
	const reachedPercentage = Math.floor(
		getProgressPercentage(promptCount, PromptProgress.TARGET_COUNT),
	);

	const countLabel = promptCount.toLocaleString(Locale.EN_US);
	const targetLabel = PromptProgress.TARGET_COUNT.toLocaleString(Locale.EN_US);

	return (
		<section className={styles["card"]}>
			<h2 className={styles["title"]}>{DatasetTargetMessage.TITLE}</h2>
			<div className={styles["summary"]}>
				<p className={styles["reached"]}>
					{reachedPercentage}% {DatasetTargetMessage.REACHED}
				</p>
				<span className={styles["count"]}>
					{countLabel} / {targetLabel}
				</span>
			</div>
			<ProgressBar
				count={promptCount}
				isSummaryHidden
				label={DatasetTargetMessage.TITLE}
				target={PromptProgress.TARGET_COUNT}
			/>
		</section>
	);
};

export { DatasetTarget };
