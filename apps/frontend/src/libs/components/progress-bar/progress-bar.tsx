import React from "react";

import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";

import { PERCENTAGE_SCALE } from "./libs/constants/constants.js";
import { getProgressPercentage } from "./libs/helpers/helpers.js";
import styles from "./styles.module.css";

type Properties = {
	className?: string | undefined;
	count: number;
	isSummaryHidden?: boolean;
	label: string;
	target: number;
	unit: string;
};

const ProgressBar: React.FC<Properties> = ({
	className,
	count,
	isSummaryHidden = false,
	label,
	target,
	unit,
}: Properties) => {
	const percentage = Math.round(getProgressPercentage(count, target));
	const countLabel = count.toLocaleString("en-US");
	const targetLabel = target.toLocaleString("en-US");
	const fillStyle = { width: `${String(percentage)}%` };

	return (
		<div className={getValidClasses(styles["row"], className)}>
			<div
				aria-label={label}
				aria-valuemax={PERCENTAGE_SCALE}
				aria-valuemin={EMPTY_LENGTH}
				aria-valuenow={percentage}
				className={styles["track"]}
				role="progressbar"
			>
				<div className={styles["fill"]} style={fillStyle} />
			</div>
			{!isSummaryHidden && (
				<>
					<span className={styles["percent"]}>{percentage}%</span>
					<span className={styles["count"]}>
						{countLabel} / {targetLabel} {unit}
					</span>
				</>
			)}
		</div>
	);
};

export { ProgressBar };
