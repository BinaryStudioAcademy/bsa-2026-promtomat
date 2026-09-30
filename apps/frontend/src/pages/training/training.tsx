import React from "react";

import { PageContainer } from "~/libs/components/page-container/page-container.js";
import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { getBrowserTimeZone } from "~/libs/helpers/helpers.js";
import { useGetPromptStreakQuery } from "~/modules/prompts/prompts-api.js";

import { mapStreakDaysToCells } from "./components/logging-streak/libs/helpers/helpers.js";
import { LoggingStreak } from "./components/logging-streak/logging-streak.js";
import { RecentPrompts } from "./components/recent-prompts/recent-prompts.js";
import { RecordPromptForm } from "./components/record-prompt-form/record-prompt-form.js";
import { useRecordPromptForm } from "./libs/hooks/use-record-prompt-form/use-record-prompt-form.hook.js";
import styles from "./styles.module.css";

const Training: React.FC = () => {
	const {
		canSubmit,
		control,
		error,
		isSubmitting,
		loggedLabel,
		mode,
		onModeChange,
		onScoreSelect,
		onSubmit,
		score,
		workspaceId,
	} = useRecordPromptForm();

	const { data: streak } = useGetPromptStreakQuery({
		timeZone: getBrowserTimeZone(),
	});

	const streakCells = mapStreakDaysToCells(streak?.days ?? []);

	return (
		<PageContainer>
			<div className={styles["page"]}>
				<section className={styles["panel"]}>
					<RecordPromptForm
						canSubmit={canSubmit}
						control={control}
						error={error}
						isSubmitting={isSubmitting}
						loggedLabel={loggedLabel}
						mode={mode}
						onModeChange={onModeChange}
						onScoreSelect={onScoreSelect}
						onSubmit={onSubmit}
						score={score}
					/>
				</section>
				<aside className={styles["aside"]}>
					<LoggingStreak
						cells={streakCells}
						currentStreak={streak?.currentStreak ?? ZERO_VALUE}
					/>
					<RecentPrompts workspaceId={workspaceId} />
				</aside>
			</div>
		</PageContainer>
	);
};

export { Training };
