import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import { ControlSize } from "~/libs/enums/control-size.enum.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { UserProfileSummaryResponseDto } from "~/modules/users/users.js";

import { getScoreColor } from "../../libs/helpers/helpers.js";
import { Section } from "../section/section.js";
import styles from "./styles.module.css";

type Properties = {
	summary: UserProfileSummaryResponseDto;
};

const Activity: React.FC<Properties> = ({ summary }: Properties) => {
	const { averageScore, totalPrompts } = summary;
	const navigate = useNavigate();

	const handleClick = useCallback((): void => {
		void navigate("/prompts/history");
	}, [navigate]);

	return (
		<Section title="YOUR PROMPT ACTIVITY">
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
			</div>
			<Button
				className={styles["activity-button"]}
				label="View prompt log history"
				onClick={handleClick}
				size={ControlSize.MD}
				type="button"
				variant="secondary"
			/>
		</Section>
	);
};

export { Activity };
