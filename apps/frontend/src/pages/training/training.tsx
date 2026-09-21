import React from "react";

import { LoggingStreak } from "./components/logging-streak/logging-streak.js";
import { RecentPrompts } from "./components/recent-prompts/recent-prompts.js";
import { RecordPromptForm } from "./components/record-prompt-form/record-prompt-form.js";
import { STREAK_PREVIEW_DAYS } from "./libs/constants/constants.js"; //--->  delete when feat: Add prompt logging streaks merge
import { useRecordPromptForm } from "./libs/hooks/use-record-prompt-form/use-record-prompt-form.hook.js";
import styles from "./styles.module.css";

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
				<LoggingStreak streakData={STREAK_PREVIEW_DAYS} />
				<RecentPrompts workspaceId={workspaceId} />
			</aside>
		</main>
	);
};

export { Training };
