import React from "react";

import { mapStreakDaysToCells } from "./components/logging-streak/libs/helpers/helpers.js";
import { LoggingStreak } from "./components/logging-streak/logging-streak.js";
import { RecentPrompts } from "./components/recent-prompts/recent-prompts.js";
import { RecordPromptForm } from "./components/record-prompt-form/record-prompt-form.js";
import { useRecordPromptForm } from "./libs/hooks/use-record-prompt-form/use-record-prompt-form.hook.js";
import styles from "./styles.module.css";

const STREAK_COUNT = 0; // TODO : delete when backend is ready -- should be derive from mapStreakDaysToCells data

const Training: React.FC = () => {
	const {
		control,
		error,
		isScoreInvalid,
		isSubmitting,
		loggedLabel,
		onScoreSelect,
		onSubmit,
		score,
		workspaceId,
	} = useRecordPromptForm();

	const streakCells = mapStreakDaysToCells([]); // TODO : fill with data from api

	return (
		<main className={styles["page"]}>
			<section className={styles["panel"]}>
				<RecordPromptForm
					control={control}
					error={error}
					isScoreInvalid={isScoreInvalid}
					isSubmitting={isSubmitting}
					loggedLabel={loggedLabel}
					onScoreSelect={onScoreSelect}
					onSubmit={onSubmit}
					score={score}
				/>
			</section>
			<aside className={styles["aside"]}>
				<LoggingStreak cells={streakCells} currentStreak={STREAK_COUNT} />
				<RecentPrompts workspaceId={workspaceId} />
			</aside>
		</main>
	);
};

export { Training };
