import React, { useCallback, useRef } from "react";

import { useCopyPrompt } from "~/libs/hooks/use-copy-prompt/use-copy-prompt.hook.js";

import { ExplanationSection } from "./libs/components/explanation-section/explanation-section.js";
import { FeedbackSection } from "./libs/components/feedback-section/feedback-section.js";
import { PromptBodySection } from "./libs/components/prompt-body-section/prompt-body-section.js";
import { PromptDeliveryCard } from "./libs/components/prompt-delivery-card/prompt-delivery-card.js";
import { PromptMetaSection } from "./libs/components/prompt-meta-section/prompt-meta-section.js";
import { type PromptDeliveryViewProperties } from "./libs/types/types.js";
import styles from "./styles.module.css";

const PromptDeliveryView: React.FC<PromptDeliveryViewProperties> = ({
	body,
	bodySlot,
	efficiencyScore,
	explanation = "",
	feedback,
	feedbackSlot,
	isBodyHeaderHidden = false,
	sources = [],
	workspaceName,
}: PromptDeliveryViewProperties) => {
	const feedbackReference = useRef<HTMLDivElement>(null);

	const handleCopied = useCallback((): void => {
		feedbackReference.current?.focus();
	}, []);

	const handleCopyPrompt = useCopyPrompt({ body, onCopied: handleCopied });

	const feedbackContent =
		feedbackSlot ?? (feedback && <FeedbackSection feedback={feedback} />);

	return (
		<div className={styles["view"]}>
			<PromptMetaSection
				efficiencyScore={efficiencyScore}
				workspaceName={workspaceName}
			/>

			<PromptBodySection
				body={body}
				bodySlot={bodySlot}
				isHeaderHidden={isBodyHeaderHidden}
				onCopyPrompt={handleCopyPrompt}
			/>

			{feedbackContent && (
				<PromptDeliveryCard cardReference={feedbackReference} tabIndex={-1}>
					{feedbackContent}
				</PromptDeliveryCard>
			)}

			<ExplanationSection explanation={explanation} sources={sources} />
		</div>
	);
};

export { PromptDeliveryView };
