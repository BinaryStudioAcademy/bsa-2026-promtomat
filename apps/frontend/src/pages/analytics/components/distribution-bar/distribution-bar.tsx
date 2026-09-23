import React from "react";

import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { PERCENTAGE_MAX } from "../../libs/constants/constants.js";
import { type ScoreTone } from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	count: number;
	description: string;
	label: string;
	percentage: number;
	range: string;
	tone: ValueOf<typeof ScoreTone>;
};

const DistributionBar: React.FC<Properties> = ({
	count,
	description,
	label,
	percentage,
	range,
	tone,
}: Properties) => {
	const roundedPercentage = Math.round(percentage);

	return (
		<li className={getValidClasses(styles["tier"], styles[tone])}>
			<div className={styles["header"]}>
				<div className={styles["heading"]}>
					<span className={styles["range"]}>{range}</span>
					<span className={styles["label"]}>{label}</span>
				</div>
				<div className={styles["stats"]}>
					<span className={styles["percent"]}>{roundedPercentage}%</span>
					<span className={styles["count"]}>{count}</span>
				</div>
			</div>
			<p className={styles["description"]}>{description}</p>
			<ProgressBar
				className={styles["bar"]}
				count={percentage}
				isSummaryHidden
				label={`${label} ${range}`}
				target={PERCENTAGE_MAX}
				unit="%"
			/>
		</li>
	);
};

export { DistributionBar };
