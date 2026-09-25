import React from "react";

import { ScoreBadge } from "~/libs/components/score-badge/score-badge.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { ValueOf } from "~/libs/types/types.js";

import { StatItemVariant } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

type Properties = {
	label: string;
	value: number | string;
	variant?: ValueOf<typeof StatItemVariant>;
};

const StatItem: React.FC<Properties> = ({
	label,
	value,
	variant = "default",
}: Properties) => {
	const isScore =
		variant === StatItemVariant.SCORE && typeof value === "number";
	return (
		<div className={styles["stat-tile"]}>
			{isScore ? (
				<ScoreBadge
					className={styles["stat-value"]}
					efficiencyScore={value}
					isFill={false}
				/>
			) : (
				<span
					className={getValidClasses(
						styles["stat-value"],
						variant === "accent" && styles["accent"],
					)}
				>
					{value}
				</span>
			)}
			<span className={styles["stat-label"]}>{label}</span>
		</div>
	);
};

export { StatItem };
