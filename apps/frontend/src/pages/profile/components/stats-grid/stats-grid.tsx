import React from "react";

import { StatItem } from "./components/stat-item/stat-item.js";
import { StatItemVariant } from "./libs/enums/stat-item-variant.enum.js";
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
		<div className={styles["stats-grid"]}>
			<StatItem
				label="Total prompts"
				value={totalPrompts}
				variant={StatItemVariant.ACCENT}
			/>
			<StatItem
				label="Average score"
				value={averageScore ?? "-"}
				variant={StatItemVariant.SCORE}
			/>
			<StatItem label="Day streak" value={currentStreak} />
		</div>
	);
};

export { StatsGrid };
