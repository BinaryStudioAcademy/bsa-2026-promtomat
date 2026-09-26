import React, { useCallback, useRef } from "react";

import { Button } from "~/libs/components/button/button.js";
import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { ButtonVariant } from "~/libs/enums/enums.js";
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

const PromptDeliveryView: React.FC<PromptDeliveryViewProperties> = ({
	body,
	efficiencyScore,
	explanation = "",
	revision,
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

	const handleScoreSelect = useCallback(() => {
		return (): void => {};
	}, []);

	const bodyEditor =
		revision?.isOwner === true
			? {
					control: revision.bodyControl,
					isEditing: revision.isEditingBody,
					isSaving: revision.isSavingBody,
					onCancel: revision.onCancelBodyEdit,
					onSave: revision.onSaveBody,
					onStart: revision.onStartBodyEdit,
				}
			: undefined;

	const isShowScoreGrid = revision === undefined || revision.isOwner;

	return (
		<div className={styles["view"]}>
			<PromptMetaSection
				efficiencyScore={efficiencyScore}
				workspaceName={workspaceName}
			/>

			<PromptBodySection
				body={body}
				onCopyPrompt={handleCopyPrompt}
				{...(bodyEditor ? { editor: bodyEditor } : {})}
			/>

			<ExplanationSection explanation={explanation} sources={sources} />

			{isShowScoreGrid && (
				<PromptDeliveryCard cardReference={feedbackReference} tabIndex={-1}>
					<ScoreGrid
						isDisabled={revision?.isSavingScore ?? false}
						isRadio={revision !== undefined}
						label={PromptDeliveryViewLabel.FEEDBACK_HEADING}
						onScoreSelect={revision?.onScoreSelect ?? handleScoreSelect}
						{...(revision ? { selectedScore: revision.selectedScore } : {})}
					/>
				</PromptDeliveryCard>
			)}

			{revision && (
				<Button
					label={PromptDeliveryViewLabel.FORK_INTO_TRAINING}
					onClick={revision.onFork}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			)}
		</div>
	);
};

export { PromptDeliveryView };
