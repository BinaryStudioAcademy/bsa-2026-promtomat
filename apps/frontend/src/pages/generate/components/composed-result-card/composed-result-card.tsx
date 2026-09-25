import React, { useCallback, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { PromptDeliveryView } from "~/libs/components/prompt-delivery-view/prompt-delivery-view.js";
import { ButtonVariant, IconName } from "~/libs/enums/enums.js";
import { getRelativeTimeLabel } from "~/libs/helpers/helpers.js";
import { useCopyPrompt } from "~/libs/hooks/use-copy-prompt/use-copy-prompt.hook.js";
import {
	type ComposedPromptAdoptRequestDto,
	type ComposedPromptDto,
	useAdoptMutation,
} from "~/modules/composed-prompts/composed-prompts.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces.js";

import { GenerateLabel, GenerateMessage } from "../../libs/enums/enums.js";
import { getProvenanceLabel } from "../../libs/helpers/helpers.js";
import { AdoptedNotice } from "../adopted-notice/adopted-notice.js";
import { ComposedBodyEditor } from "../composed-body-editor/composed-body-editor.js";
import { DiscardConfirmation } from "../discard-confirmation/discard-confirmation.js";
import { ResultCard } from "../result-card/result-card.js";
import styles from "./styles.module.css";

type Properties = {
	composedPrompt: ComposedPromptDto;
	onDiscard: () => void;
};

const ComposedResultCard: React.FC<Properties> = ({
	composedPrompt,
	onDiscard,
}: Properties) => {
	const { data: workspacesData } = useGetWorkspacesQuery({});
	const workspaceName = workspacesData?.items.find(
		({ id }) => id === composedPrompt.workspaceId,
	)?.name;

	const [adopt, { data: adoptedPrompt, isLoading: isAdopting }] =
		useAdoptMutation();
	const [appliedBody, setAppliedBody] = useState<string>(composedPrompt.body);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isDiscardConfirmationOpen, setIsDiscardConfirmationOpen] =
		useState<boolean>(false);
	const [selectedScore, setSelectedScore] = useState<null | number>(null);

	const isEdited = appliedBody !== composedPrompt.body;
	const hasActions = !isAdopting && !isEditing && adoptedPrompt === undefined;

	const handleCopyPrompt = useCopyPrompt({ body: appliedBody });

	const handleScoreSelect = useCallback(
		(score: number) => {
			return (): void => {
				const payload: ComposedPromptAdoptRequestDto = isEdited
					? { promptBody: appliedBody, score }
					: { score };

				setSelectedScore(score);
				void adopt({ id: composedPrompt.id, payload });
			};
		},
		[adopt, appliedBody, composedPrompt.id, isEdited],
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
		if (isEdited) {
			setIsDiscardConfirmationOpen(true);

			return;
		}

		onDiscard();
	}, [isEdited, onDiscard]);

	const handleDiscardCancel = useCallback((): void => {
		setIsDiscardConfirmationOpen(false);
	}, []);

	return (
		<ResultCard>
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
				explanation={composedPrompt.explanation.trim()}
				feedback={
					adoptedPrompt === undefined
						? {
								hint: isEdited
									? GenerateMessage.EDITED_HINT
									: GenerateMessage.RATE_HINT,
								isDisabled: isAdopting || isEditing,
								label: GenerateLabel.RATE_HEADING,
								onScoreSelect: handleScoreSelect,
								selectedScore,
							}
						: undefined
				}
				feedbackSlot={
					adoptedPrompt === undefined ? undefined : (
						<AdoptedNotice prompt={adoptedPrompt} />
					)
				}
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
			</ResultCard.Actions>
			<DiscardConfirmation
				isOpen={isDiscardConfirmationOpen}
				onCancel={handleDiscardCancel}
				onConfirm={onDiscard}
			/>
		</ResultCard>
	);
};

export { ComposedResultCard };
