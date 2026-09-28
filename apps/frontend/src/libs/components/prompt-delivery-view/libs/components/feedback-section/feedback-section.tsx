import React from "react";

import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";

import { type PromptDeliveryFeedback } from "../../types/types.js";
import styles from "./styles.module.css";

type Properties = {
	feedback: PromptDeliveryFeedback;
};

const FeedbackSection: React.FC<Properties> = ({ feedback }: Properties) => {
	const isRadio = Boolean(feedback.selectedScore);

	return (
		<>
			<ScoreGrid
				isDisabled={feedback.isDisabled ?? false}
				isRadio={isRadio}
				label={feedback.label}
				onScoreSelect={feedback.onScoreSelect}
				selectedScore={feedback.selectedScore ?? null}
			/>
			{feedback.hint && <p className={styles["hint"]}>{feedback.hint}</p>}
		</>
	);
};

export { FeedbackSection };
