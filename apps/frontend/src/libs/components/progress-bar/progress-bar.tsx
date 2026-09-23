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
	className?: string | undefined;
	count: number;
	isSummaryHidden?: boolean;
	label: string;
	target: number;
	unit?: string;
};

const ProgressBar: React.FC<Properties> = ({
	className,
	count,
	isSummaryHidden = false,
	label,
	target,
	unit,
}: Properties) => {
	const percentage = getProgressPercentage(count, target);
	const countLabel = count.toLocaleString("en-US");
	const targetLabel = target.toLocaleString("en-US");
	const fillStyle = { width: `${String(percentage)}%` };
	const fillTone = getProgressFillTone(percentage);

	return (
		<div className={getValidClasses(styles["progress"], className)}>
			{!isSummaryHidden && (
				<div className={styles["heading"]}>
					<span className={styles["label"]}>{label}</span>
					<span className={styles["count"]}>
						{countLabel} / {targetLabel}
						{unit ? ` ${unit}` : null}
					</span>
				</div>
			)}
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
