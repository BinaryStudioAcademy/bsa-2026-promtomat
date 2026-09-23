import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import { Link } from "~/libs/components/link/link.js";
import { ControlSize } from "~/libs/enums/control-size.enum.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { UserProfileSummaryResponseDto } from "~/modules/users/users.js";

import { Section } from "../section/section.js";
import { StatsGrid } from "../stats-grid/stats-grid.js";
import styles from "./styles.module.css";

type Properties = {
	summary: UserProfileSummaryResponseDto;
};

const Activity: React.FC<Properties> = ({ summary }: Properties) => {
	const { totalPrompts } = summary;
	const navigate = useNavigate();

	const handleClick = useCallback((): void => {
		void navigate(AppRoute.PROMPTS_HISTORY);
	}, [navigate]);

	return (
		<Section title="YOUR PROMPT ACTIVITY">
			{totalPrompts ? (
				<>
					<StatsGrid summary={summary} />
					<Button
						className={styles["activity-button"]}
						label="View prompt log history"
						onClick={handleClick}
						size={ControlSize.LG}
						type="button"
						variant="secondary"
					/>
				</>
			) : (
				<div className={styles["empty-state"]}>
					<p className={styles["empty-state-text"]}>No Prompts Yet</p>
					<p className={styles["empty-state-subtext"]}>
						Once you do, your totals and average score will show up here.
					</p>
					<Link className={styles["empty-state-cta"]} to={AppRoute.TRAINING}>
						Create one to get started
					</Link>
				</div>
			)}
		</Section>
	);
};

export { Activity };
