import React from "react";

import { RecentPrompts } from "./components/recent-prompts/recent-prompts.js";
import { RecordPromptForm } from "./components/record-prompt-form/record-prompt-form.js";
import { TrainingProgress } from "./components/training-progress/training-progress.js";
import { useRecordPromptForm } from "./libs/hooks/use-record-prompt-form/use-record-prompt-form.hook.js";
import styles from "./styles.module.css";

const Training: React.FC = () => {
	const { control, isSubmitting, onScoreSelect, workspaceId } =
		useRecordPromptForm();

	return (
		<main className={styles["page"]}>
			<section className={styles["panel"]}>
				<RecordPromptForm
					control={control}
					isSubmitting={isSubmitting}
					onScoreSelect={onScoreSelect}
				/>
			</section>
			<aside className={styles["aside"]}>
				<TrainingProgress workspaceId={workspaceId} />
				<RecentPrompts workspaceId={workspaceId} />
			</aside>
		</main>
	);
};

export { Training };
