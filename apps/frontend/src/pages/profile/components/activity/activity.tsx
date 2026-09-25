import React from "react";

import { ButtonLink } from "~/libs/components/button-link/button-link.js";
import { Link } from "~/libs/components/link/link.js";
import { ControlSize } from "~/libs/enums/control-size.enum.js";
import { AppRoute, ButtonVariant } from "~/libs/enums/enums.js";

import { Section } from "../section/section.js";
import { StatsGrid } from "../stats-grid/stats-grid.js";
import styles from "./styles.module.css";

type Properties = {
	averageScore: null | number;
	currentStreak: number;
	totalPrompts: number;
};

const Activity: React.FC<Properties> = ({
	averageScore,
	currentStreak,
	totalPrompts,
}: Properties) => {
	return (
		<Section title="YOUR PROMPT ACTIVITY">
			{totalPrompts ? (
				<>
					<StatsGrid
						averageScore={averageScore}
						currentStreak={currentStreak}
						totalPrompts={totalPrompts}
					/>
					<ButtonLink
						className={styles["activity-button"]}
						label="View prompt log history"
						size={ControlSize.LG}
						to={AppRoute.SMART_SEARCH}
						variant={ButtonVariant.SECONDARY}
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
