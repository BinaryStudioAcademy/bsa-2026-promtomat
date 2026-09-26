import React from "react";

import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";

import { type PromptDeliveryFeedback } from "../../types/types.js";
import styles from "./styles.module.css";

type Properties = {
	feedback: PromptDeliveryFeedback;
};

const FeedbackSection: React.FC<Properties> = ({ feedback }: Properties) => {
	const hasSelectedScore = feedback.selectedScore !== undefined;

	return (
		<>
			<ScoreGrid
				isDisabled={feedback.isDisabled ?? false}
				isRadio={hasSelectedScore}
				label={feedback.label}
				onScoreSelect={feedback.onScoreSelect}
				selectedScore={feedback.selectedScore ?? null}
			/>
			{feedback.hint && <p className={styles["hint"]}>{feedback.hint}</p>}
		</>
	);
};

export { FeedbackSection };
