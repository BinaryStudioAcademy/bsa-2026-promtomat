import React from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";
import { UserProfileSummaryResponseDto } from "~/modules/users/users.js";

import { getScoreColor } from "../../libs/helpers/helpers.js";
import styles from "./styles.module.css";

type Properties = {
	summary: UserProfileSummaryResponseDto;
};

const StatsGrid: React.FC<Properties> = ({ summary }: Properties) => {
	const { averageScore, totalPrompts } = summary;

	return (
		<div className={styles["stats-grid"]}>
			<div className={styles["stat-tile"]}>
				<span
					className={getValidClasses(styles["stat-value"], styles["accent"])}
				>
					{totalPrompts}
				</span>
				<span className={styles["stat-label"]}>Total prompts</span>
			</div>
			<div className={styles["stat-tile"]}>
				<span
					className={getValidClasses(
						styles["stat-value"],
						styles[getScoreColor(averageScore)],
					)}
				>
					{averageScore}
				</span>
				<span className={styles["stat-label"]}>Average score</span>
			</div>
			<div className={styles["stat-tile"]}>
				<span className={styles["stat-value"]}>TODO</span>
				<span className={styles["stat-label"]}>Day streak</span>
			</div>
		</div>
	);
};

export { StatsGrid };
