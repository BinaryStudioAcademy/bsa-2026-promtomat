import React from "react";

import { EMPTY_TARGET, PERCENTAGE_SCALE } from "./libs/constants/constants.js";
import { getProgressPercentage } from "./libs/helpers/helpers.js";
import styles from "./styles.module.css";

type Properties = {
	count: number;
	label: string;
	target: number;
	unit: string;
};

const ProgressBar: React.FC<Properties> = ({
	count,
	label,
	target,
	unit,
}: Properties) => {
	const percentage = Math.round(getProgressPercentage(count, target));
	const countLabel = count.toLocaleString("en-US");
	const targetLabel = target.toLocaleString("en-US");
	const fillStyle = { width: `${String(percentage)}%` };

	return (
		<div className={styles["row"]}>
			<div
				aria-label={label}
				aria-valuemax={PERCENTAGE_SCALE}
				aria-valuemin={EMPTY_TARGET}
				aria-valuenow={percentage}
				className={styles["track"]}
				role="progressbar"
			>
				<div className={styles["fill"]} style={fillStyle} />
			</div>
			<span className={styles["percent"]}>{percentage}%</span>
			<span className={styles["count"]}>
				{countLabel} / {targetLabel} {unit}
			</span>
		</div>
	);
};

export { ProgressBar };
