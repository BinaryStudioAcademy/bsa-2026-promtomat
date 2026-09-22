import React from "react";

import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";

import { PERCENTAGE_SCALE } from "./libs/constants/constants.js";
import {
	getProgressFillTone,
	getProgressPercentage,
} from "./libs/helpers/helpers.js";
import styles from "./styles.module.css";

type Properties = {
	count: number;
	label: string;
	target: number;
};

const ProgressBar: React.FC<Properties> = ({
	count,
	label,
	target,
}: Properties) => {
	const percentage = getProgressPercentage(count, target);
	const countLabel = count.toLocaleString("en-US");
	const targetLabel = target.toLocaleString("en-US");
	const fillStyle = { width: `${String(percentage)}%` };
	const fillTone = getProgressFillTone(percentage);

	return (
		<div className={styles["progress"]}>
			<div className={styles["heading"]}>
				<span className={styles["label"]}>{label}</span>
				<span className={styles["count"]}>
					{countLabel} / {targetLabel}
				</span>
			</div>
			<div
				aria-label={label}
				aria-valuemax={PERCENTAGE_SCALE}
				aria-valuemin={EMPTY_LENGTH}
				aria-valuenow={percentage}
				className={styles["track"]}
				role="progressbar"
			>
				<div
					className={getValidClasses(styles["fill"], styles[fillTone])}
					style={fillStyle}
				/>
			</div>
		</div>
	);
};

export { ProgressBar };
