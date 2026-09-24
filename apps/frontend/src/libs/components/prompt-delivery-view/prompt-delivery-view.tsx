import React, { useCallback, useRef } from "react";

import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { showNotification } from "~/libs/modules/notification/notification.js";

import { ExplanationSection } from "./libs/components/explanation-section/explanation-section.js";
import { PromptBodySection } from "./libs/components/prompt-body-section/prompt-body-section.js";
import { PromptDeliveryCard } from "./libs/components/prompt-delivery-card/prompt-delivery-card.js";
import { PromptMetaSection } from "./libs/components/prompt-meta-section/prompt-meta-section.js";
import {
	PromptDeliveryViewLabel,
	PromptDeliveryViewMessage,
} from "./libs/enums/enums.js";
import { type PromptDeliveryViewProperties } from "./libs/types/types.js";
import styles from "./styles.module.css";

const NOOP = (): void => {};

const PromptDeliveryView: React.FC<PromptDeliveryViewProperties> = ({
	body,
	computedScore,
	efficiencyScore,
	explanation = "",
	onScoreSelect = NOOP,
	sources = [],
	workspaceName,
}: PromptDeliveryViewProperties) => {
	const feedbackReference = useRef<HTMLDivElement>(null);

	const handleCopyPrompt = useCallback((): void => {
		void navigator.clipboard
			.writeText(body)
			.then(() => {
				showNotification({
					message: PromptDeliveryViewMessage.COPY_SUCCESS,
					type: NotificationType.SUCCESS,
				});
				feedbackReference.current?.focus();
			})
			.catch(() => {
				showNotification({
					message: PromptDeliveryViewMessage.COPY_FAILURE,
					type: NotificationType.DANGER,
				});
			});
	}, [body]);

	const handleScoreSelect = useCallback(
		(score: number) => {
			return (): void => {
				onScoreSelect(score);
			};
		},
		[onScoreSelect],
	);

	return (
		<div className={styles["view"]}>
			<PromptMetaSection
				computedScore={computedScore}
				efficiencyScore={efficiencyScore}
				workspaceName={workspaceName}
			/>

			<PromptBodySection body={body} onCopyPrompt={handleCopyPrompt} />

			<ExplanationSection explanation={explanation} sources={sources} />

			<PromptDeliveryCard cardReference={feedbackReference} tabIndex={-1}>
				<ScoreGrid
					label={PromptDeliveryViewLabel.FEEDBACK_HEADING}
					onScoreSelect={handleScoreSelect}
				/>
			</PromptDeliveryCard>
		</div>
	);
};

export { PromptDeliveryView };
