import React from "react";

import { Locale } from "~/libs/enums/enums.js";

import { getProgressPercentage } from "../progress-bar/libs/helpers/helpers.js";
import { ProgressBar } from "../progress-bar/progress-bar.js";
import { DatasetTargetMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	promptCount: number;
	target: number;
};

const DatasetTarget: React.FC<Properties> = ({
	promptCount,
	target,
}: Properties) => {
	const reachedPercentage = Math.floor(
		getProgressPercentage(promptCount, target),
	);

	const countLabel = promptCount.toLocaleString(Locale.EN_US);
	const targetLabel = target.toLocaleString(Locale.EN_US);

	return (
		<div className={styles["progress"]}>
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
				target={target}
			/>
		</div>
	);
};

export { DatasetTarget };
