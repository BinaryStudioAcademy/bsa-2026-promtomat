import React, { useCallback, useRef } from "react";

import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { useCopyPrompt } from "~/libs/hooks/use-copy-prompt/use-copy-prompt.hook.js";

import { ExplanationSection } from "./libs/components/explanation-section/explanation-section.js";
import { PromptBodySection } from "./libs/components/prompt-body-section/prompt-body-section.js";
import { PromptDeliveryCard } from "./libs/components/prompt-delivery-card/prompt-delivery-card.js";
import { PromptMetaSection } from "./libs/components/prompt-meta-section/prompt-meta-section.js";
import { type PromptDeliveryViewProperties } from "./libs/types/types.js";
import styles from "./styles.module.css";

const PromptDeliveryView: React.FC<PromptDeliveryViewProperties> = ({
	body,
	efficiencyScore,
	explanation = "",
	feedback,
	isBodyHeaderHidden = false,
	sources = [],
	workspaceName,
}: PromptDeliveryViewProperties) => {
	const feedbackReference = useRef<HTMLDivElement>(null);

	const handleCopied = useCallback((): void => {
		feedbackReference.current?.focus();
	}, []);

	const handleCopyPrompt = useCopyPrompt({ body, onCopied: handleCopied });

	return (
		<div className={styles["view"]}>
			<PromptMetaSection
				efficiencyScore={efficiencyScore}
				workspaceName={workspaceName}
			/>

			<PromptBodySection
				body={body}
				isHeaderHidden={isBodyHeaderHidden}
				onCopyPrompt={handleCopyPrompt}
			/>

			{feedback && (
				<PromptDeliveryCard cardReference={feedbackReference} tabIndex={-1}>
					<ScoreGrid
						label={feedback.label}
						onScoreSelect={feedback.onScoreSelect}
					/>
					{feedback.hint && (
						<p className={styles["feedback-hint"]}>{feedback.hint}</p>
					)}
				</PromptDeliveryCard>
			)}

			<ExplanationSection explanation={explanation} sources={sources} />
		</div>
	);
};

export { PromptDeliveryView };
