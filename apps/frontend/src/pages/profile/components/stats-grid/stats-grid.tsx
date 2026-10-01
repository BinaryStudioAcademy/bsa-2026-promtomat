import React from "react";

import { ScoreValue } from "~/libs/components/score-value/score-value.js";
import { StatCard } from "~/libs/components/stat-card/stat-card.js";
import { StatGrid } from "~/libs/components/stat-grid/stat-grid.js";
import { SCORE_SCALE_CAPTION } from "~/libs/constants/constants.js";

import { ActivityStatLabel } from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	averageScore: null | number;
	currentStreak: number;
	totalPrompts: number;
};

const StatsGrid: React.FC<Properties> = ({
	averageScore,
	currentStreak,
	totalPrompts,
}: Properties) => {
	return (
		<StatGrid label={ActivityStatLabel.SECTION}>
			<StatCard
				className={styles["card"]}
				label={ActivityStatLabel.TOTAL_PROMPTS}
			>
				<span className={styles["accent"]}>{totalPrompts}</span>
			</StatCard>
			<StatCard
				caption={averageScore === null ? undefined : SCORE_SCALE_CAPTION}
				className={styles["card"]}
				label={ActivityStatLabel.AVERAGE_SCORE}
			>
				<ScoreValue score={averageScore} />
			</StatCard>
			<StatCard className={styles["card"]} label={ActivityStatLabel.DAY_STREAK}>
				{currentStreak}
			</StatCard>
		</StatGrid>
	);
};

export { StatsGrid };
