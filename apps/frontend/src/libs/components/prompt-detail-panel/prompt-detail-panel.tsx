import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { InlineEdit } from "~/libs/components/inline-edit/inline-edit.js";
import { Link } from "~/libs/components/link/link.js";
import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { ScoreBadge } from "~/libs/components/score-badge/score-badge.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { SegmentedControl } from "~/libs/components/segmented-control/segmented-control.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
import { AppRoute, ButtonVariant, IconName } from "~/libs/enums/enums.js";
import {
	configureString,
	getRelativeTimeLabel,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { type NavigableRoute, type ValueOf } from "~/libs/types/types.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";
import { PromptValidationRule } from "~/modules/prompts/libs/enums/enums.js";
import { usePromptRevision } from "~/modules/prompts/libs/hooks/use-prompt-revision/use-prompt-revision.hook.js";
import {
	type PromptGetQueryDto,
	type PromptItemResponseDto,
	type PromptUpdateIntentRequestDto,
} from "~/modules/prompts/libs/types/types.js";
import { useUpdateTaskIntentMutation } from "~/modules/prompts/prompts-api.js";
import { promptUpdateIntentValidationSchema } from "~/modules/prompts/prompts.js";

import {
	PromptDetailBodyView,
	PromptDetailLabel,
	PromptDetailMessage,
} from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const BODY_HEIGHT_PX = 200;

const BODY_VIEW_OPTIONS = [
	{
		label: PromptDetailLabel.PREVIEW,
		value: PromptDetailBodyView.PREVIEW,
	},
	{
		label: PromptDetailLabel.WRITE,
		value: PromptDetailBodyView.WRITE,
	},
] as const;

type Properties = {
	isCompact?: boolean;
	prompt: PromptItemResponseDto;
	queryPayload: Omit<PromptGetQueryDto, "page">;
	showOpenFullPageLink?: boolean;
};

const PromptDetailPanel: React.FC<Properties> = ({
	isCompact = true,
	prompt,
	queryPayload,
	showOpenFullPageLink = true,
}: Properties) => {
	const { data: user } = useGetAuthenticatedUserQuery(undefined);
	const [updateIntent] = useUpdateTaskIntentMutation();
	const {
		bodyControl,
		handleCancelBodyEdit,
		handleFork,
		handleSaveBody,
		handleScoreSelect,
		handleStartBodyEdit,
		isEditingBody,
		isSavingBody,
		isSavingScore,
	} = usePromptRevision({ prompt });
	const { control, errors, handleSubmit, reset } =
		useAppForm<PromptUpdateIntentRequestDto>({
			defaultValues: { taskIntent: prompt.intent },
			validationSchema: promptUpdateIntentValidationSchema,
		});

	const descriptionId = useId();
	const lastValidIntentReference = useRef(prompt.intent);
	const editorReference = useRef<HTMLDivElement>(null);
	const [isCopyPending, setIsCopyPending] = useState(false);

	const errorMessage = errors.taskIntent?.message;
	const isOwner = user?.id === prompt.userId;
	const relativeTime = getRelativeTimeLabel(prompt.createdAt);
	const deliveryPath = configureString(AppRoute.PROMPTS_$PROMPT_ID, {
		promptId: String(prompt.id),
	}) as NavigableRoute;

	useEffect(() => {
		lastValidIntentReference.current = prompt.intent;
		reset({ taskIntent: prompt.intent });
	}, [prompt.id, prompt.intent, reset]);

	useEffect(() => {
		if (!isEditingBody) {
			return;
		}

		editorReference.current?.querySelector("textarea")?.focus();
	}, [isEditingBody]);

	const handleSaveUpdatedIntent = useCallback((): void => {
		void handleSubmit(
			async (payload: PromptUpdateIntentRequestDto) => {
				const previousIntent = lastValidIntentReference.current;
				lastValidIntentReference.current = payload.taskIntent;

				try {
					await updateIntent({
						id: prompt.id,
						payload,
						queryArgs: queryPayload,
					}).unwrap();
					showNotification({
						message: PromptDetailMessage.UPDATE_INTENT_SUCCESS,
						type: NotificationType.SUCCESS,
					});
				} catch {
					lastValidIntentReference.current = previousIntent;
					reset({ taskIntent: previousIntent });
				}
			},
			() => {
				reset(
					{ taskIntent: lastValidIntentReference.current },
					{ keepErrors: true },
				);
			},
		)();
	}, [handleSubmit, prompt.id, queryPayload, reset, updateIntent]);

	const handleBodyViewChange = useCallback(
		(view: ValueOf<typeof PromptDetailBodyView>): void => {
			if (isSavingBody) {
				return;
			}

			if (view === PromptDetailBodyView.WRITE) {
				handleStartBodyEdit();
				return;
			}

			handleCancelBodyEdit();
		},
		[handleCancelBodyEdit, handleStartBodyEdit, isSavingBody],
	);

	const handleCopyPrompt = useCallback((): void => {
		setIsCopyPending(true);
		void navigator.clipboard
			.writeText(prompt.body)
			.then(() => {
				showNotification({
					message: PromptDetailMessage.COPY_SUCCESS,
					type: NotificationType.SUCCESS,
				});
			})
			.catch(() => {
				showNotification({
					message: PromptDetailMessage.COPY_FAILURE,
					type: NotificationType.DANGER,
				});
			})
			.finally(() => {
				setIsCopyPending(false);
			});
	}, [prompt.body]);

	return (
		<article className={styles["panel"]}>
			<div className={styles["heading"]}>
				<div className={styles["title-row"]}>
					{isOwner ? (
						<div className={styles["intent-wrapper"]}>
							<InlineEdit
								className={styles["intent"]}
								control={control}
								descriptionId={descriptionId}
								isLabelHidden={true}
								label={PromptDetailLabel.TASK_INTENT}
								name="taskIntent"
								onSave={handleSaveUpdatedIntent}
								size="sm"
							/>
						</div>
					) : (
						<h2 className={styles["intent"]}>{prompt.intent}</h2>
					)}
					{prompt.score === null ? (
						<span className={styles["unrated"]}>
							{PromptDetailLabel.UNRATED}
						</span>
					) : (
						<ScoreBadge
							efficiencyScore={prompt.score}
							label={`${String(prompt.score)}/${String(PromptValidationRule.EFFICIENCY_SCORE_MAX)}`}
						/>
					)}
				</div>
				<div
					className={
						errorMessage
							? getValidClasses(styles["meta"], styles["error"])
							: styles["meta"]
					}
				>
					{errorMessage ?? (
						<>
							<span>{prompt.workspaceName}</span>
							<span aria-hidden="true">·</span>
							<span>{relativeTime}</span>
						</>
					)}
				</div>
			</div>

			<div className={styles["toolbar"]}>
				{isOwner && (
					<>
						<SegmentedControl
							label={PromptDetailLabel.PROMPT_VIEW}
							onChange={handleBodyViewChange}
							options={BODY_VIEW_OPTIONS}
							value={
								isEditingBody
									? PromptDetailBodyView.WRITE
									: PromptDetailBodyView.PREVIEW
							}
							variant="raised"
						/>
						<span className={styles["format"]}>
							{PromptDetailLabel.MARKDOWN}
						</span>
					</>
				)}
				{showOpenFullPageLink && (
					<Link
						className={styles["open-link"]}
						hasDefaultStyles={false}
						to={deliveryPath}
					>
						{PromptDetailLabel.OPEN_FULL_PAGE}
						<Icon
							className={styles["open-link-icon"]}
							iconName={IconName.CHEVRON}
						/>
					</Link>
				)}
			</div>

			{isOwner && isEditingBody ? (
				<div
					className={getValidClasses(
						styles["editor"],
						isCompact && styles["editor-compact"],
					)}
					ref={editorReference}
				>
					<Textarea
						control={bodyControl}
						isDisabled={isSavingBody}
						isLabelHidden
						isMessageHidden
						label={PromptDetailLabel.WRITE}
						maxHeight={isCompact ? BODY_HEIGHT_PX : null}
						name="promptBody"
						rows={4}
					/>
				</div>
			) : (
				<div
					className={getValidClasses(
						styles["body"],
						isCompact && styles["body-compact"],
					)}
				>
					{prompt.body}
				</div>
			)}

			{isOwner && (
				<div className={styles["rating"]}>
					<ScoreGrid
						isDisabled={isSavingScore}
						isRadio
						label={PromptDetailLabel.YOUR_RATING}
						onScoreSelect={handleScoreSelect}
						selectedScore={prompt.score}
						variant="inset"
					/>
				</div>
			)}

			<div className={styles["actions"]}>
				{isOwner && isEditingBody ? (
					<>
						<Button
							className={styles["copy-button"]}
							isDisabled={isSavingBody}
							isLoading={isSavingBody}
							label={PromptDetailLabel.SAVE_PROMPT}
							onClick={handleSaveBody}
							type="button"
							variant={ButtonVariant.PRIMARY}
						/>
						<Button
							className={styles["fork-button"]}
							isDisabled={isSavingBody}
							label={PromptDetailLabel.CANCEL}
							onClick={handleCancelBodyEdit}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
					</>
				) : (
					<>
						<Button
							className={styles["copy-button"]}
							iconName={IconName.COPY}
							isDisabled={isCopyPending}
							isLoading={isCopyPending}
							label={PromptDetailLabel.COPY_PROMPT}
							onClick={handleCopyPrompt}
							type="button"
							variant={ButtonVariant.PRIMARY}
						/>
						<Button
							className={styles["fork-button"]}
							label={PromptDetailLabel.FORK}
							onClick={handleFork}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
					</>
				)}
			</div>
		</article>
	);
};

export { PromptDetailPanel };
