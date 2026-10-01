import React, { useCallback, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { PromptDeliveryView } from "~/libs/components/prompt-delivery-view/prompt-delivery-view.js";
import { ZERO_VALUE } from "~/libs/constants/constants.js";
import {
	ButtonVariant,
	EvaluationTargetType,
	IconName,
} from "~/libs/enums/enums.js";
import { getRelativeTimeLabel } from "~/libs/helpers/helpers.js";
import { useCopyPrompt } from "~/libs/hooks/use-copy-prompt/use-copy-prompt.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type ComposedPromptDto } from "~/modules/composed-prompts/composed-prompts.js";
import {
	EvaluationMessage,
	useEvaluateMutation,
} from "~/modules/evaluations/evaluations.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces.js";

import {
	GenerateLabel,
	GenerateMessage,
	PendingCardAction,
} from "../../libs/enums/enums.js";
import {
	getProvenanceLabel,
	getRecompositionsLeftLabel,
} from "../../libs/helpers/helpers.js";
import { ComposedBodyEditor } from "../composed-body-editor/composed-body-editor.js";
import { PendingActionConfirmation } from "../pending-action-confirmation/pending-action-confirmation.js";
import { ResultCard } from "../result-card/result-card.js";
import styles from "./styles.module.css";

type Properties = {
	composedPrompt: ComposedPromptDto;
	onDiscard: () => void;
	onRecompose: () => void;
	remainingRecompositions: number;
};

const ComposedResultCard: React.FC<Properties> = ({
	composedPrompt,
	onDiscard,
	onRecompose,
	remainingRecompositions,
}: Properties) => {
	const { data: workspacesData } = useGetWorkspacesQuery({});
	const workspaceName = workspacesData?.items.find(
		({ id }) => id === composedPrompt.workspaceId,
	)?.name;

	const [evaluate, { isLoading: isEvaluating }] = useEvaluateMutation();
	const [appliedBody, setAppliedBody] = useState<string>(composedPrompt.body);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [pendingAction, setPendingAction] = useState<null | ValueOf<
		typeof PendingCardAction
	>>(null);
	const [selectedScore, setSelectedScore] = useState<null | number>(
		composedPrompt.myScore ?? null,
	);

	const isEdited = appliedBody !== composedPrompt.body;
	const hasUnsavedEdits = isEdited;
	const hasActions = !isEvaluating && !isEditing;
	const isRecomposePending = pendingAction === PendingCardAction.RECOMPOSE;
	const isRecomposeDisabled =
		isEvaluating || isEditing || remainingRecompositions === ZERO_VALUE;

	const handleCopyPrompt = useCopyPrompt({ body: appliedBody });

	const handleScoreSelect = useCallback(
		(score: number) => {
			return (): void => {
				setSelectedScore(score);
				void evaluate({
					score,
					targetId: composedPrompt.id,
					targetType: EvaluationTargetType.COMPOSED_PROMPT,
				})
					.unwrap()
					.then(() => {
						showNotification({
							message: EvaluationMessage.EVALUATION_SUCCESS,
							type: NotificationType.SUCCESS,
						});
					})
					.catch(() => {
						showNotification({
							message: EvaluationMessage.EVALUATION_FAILED,
							type: NotificationType.DANGER,
						});
					});
			};
		},
		[composedPrompt.id, evaluate],
	);

	const handleEditStart = useCallback((): void => {
		setIsEditing(true);
	}, []);

	const handleEditApply = useCallback((body: string): void => {
		setAppliedBody(body);
		setIsEditing(false);
	}, []);

	const handleEditCancel = useCallback((): void => {
		setIsEditing(false);
	}, []);

	const handleDiscardRequest = useCallback((): void => {
		if (hasUnsavedEdits) {
			setPendingAction(PendingCardAction.DISCARD);

			return;
		}

		onDiscard();
	}, [hasUnsavedEdits, onDiscard]);

	const handleRecomposeRequest = useCallback((): void => {
		if (hasUnsavedEdits) {
			setPendingAction(PendingCardAction.RECOMPOSE);

			return;
		}

		onRecompose();
	}, [hasUnsavedEdits, onRecompose]);

	const handleActionCancel = useCallback((): void => {
		setPendingAction(null);
	}, []);

	const handleActionConfirm = useCallback((): void => {
		setPendingAction(null);

		if (isRecomposePending) {
			onRecompose();

			return;
		}

		onDiscard();
	}, [isRecomposePending, onDiscard, onRecompose]);

	return (
		<ResultCard>
			<header className={styles["header"]}>
				<ResultCard.Kicker>
					{isEdited
						? GenerateLabel.EDITED_KICKER
						: GenerateLabel.GENERATED_KICKER}
				</ResultCard.Kicker>
				<p className={styles["provenance"]}>
					<span>
						{getProvenanceLabel({
							sourceCount: composedPrompt.sources.length,
							workspaceName,
						})}
					</span>
					<span aria-hidden="true">·</span>
					<span>{getRelativeTimeLabel(composedPrompt.createdAt)}</span>
				</p>
			</header>
			<PromptDeliveryView
				body={appliedBody}
				bodySlot={
					isEditing ? (
						<ComposedBodyEditor
							body={appliedBody}
							onApply={handleEditApply}
							onCancel={handleEditCancel}
						/>
					) : undefined
				}
				computedScore={composedPrompt.computedScore}
				explanation={composedPrompt.explanation.trim()}
				feedback={{
					hint: GenerateMessage.RATE_HINT,
					isDisabled: isEvaluating || isEditing,
					label: GenerateLabel.RATE_HEADING,
					onScoreSelect: handleScoreSelect,
					selectedScore,
				}}
				isBodyHeaderHidden
				sources={composedPrompt.sources}
			/>
			<ResultCard.Actions>
				<Button
					iconName={IconName.COPY}
					label={GenerateLabel.COPY_PROMPT}
					onClick={handleCopyPrompt}
					type="button"
					variant={ButtonVariant.PRIMARY}
				/>
				{hasActions && (
					<Button
						iconName={IconName.EDIT}
						label={GenerateLabel.EDIT}
						onClick={handleEditStart}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
				)}
				{hasActions && (
					<Button
						label={GenerateLabel.DISCARD}
						onClick={handleDiscardRequest}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
				)}
				<div className={styles["recompose"]}>
					<Button
						isDisabled={isRecomposeDisabled}
						label={GenerateLabel.RECOMPOSE}
						onClick={handleRecomposeRequest}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
					<span className={styles["recompose-hint"]}>
						{getRecompositionsLeftLabel(remainingRecompositions)}
					</span>
				</div>
			</ResultCard.Actions>
			<PendingActionConfirmation
				confirmLabel={
					isRecomposePending ? GenerateLabel.RECOMPOSE : GenerateLabel.DISCARD
				}
				isOpen={pendingAction !== null}
				onCancel={handleActionCancel}
				onConfirm={handleActionConfirm}
				title={
					isRecomposePending
						? GenerateMessage.RECOMPOSE_TITLE
						: GenerateMessage.DISCARD_TITLE
				}
			/>
		</ResultCard>
	);
};

export { ComposedResultCard };
