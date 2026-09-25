import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { InlineEdit } from "~/libs/components/inline-edit/inline-edit.js";
import { Link } from "~/libs/components/link/link.js";
import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { ScoreBadge } from "~/libs/components/score-badge/score-badge.js";
import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { AppRoute, ButtonVariant, IconName } from "~/libs/enums/enums.js";
import {
	configureString,
	getRelativeTimeLabel,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { type NavigableRoute } from "~/libs/types/types.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";
import { FRACTION_DIGITS } from "~/modules/prompts/libs/constants/constants.js";
import { PromptValidationRule } from "~/modules/prompts/libs/enums/enums.js";
import {
	type PromptGetQueryDto,
	type PromptUpdateIntentRequestDto,
} from "~/modules/prompts/libs/types/types.js";
import { useUpdateTaskIntentMutation } from "~/modules/prompts/prompts-api.js";
import { promptUpdateIntentValidationSchema } from "~/modules/prompts/prompts.js";

import {
	PromptHistoryLabel,
	PromptHistoryMessage,
} from "../../libs/enums/enum.js";
import { type PromptHistoryItem } from "../../libs/types/types.js";
import styles from "./styles.module.css";

type Properties = {
	prompt: PromptHistoryItem;
	queryPayload: Omit<PromptGetQueryDto, "page">;
};

const PromptDetailPanel: React.FC<Properties> = ({
	prompt,
	queryPayload,
}: Properties) => {
	const { data: user } = useGetAuthenticatedUserQuery(undefined);
	const [updateIntent] = useUpdateTaskIntentMutation();
	const { control, errors, handleSubmit, reset } =
		useAppForm<PromptUpdateIntentRequestDto>({
			defaultValues: { taskIntent: prompt.intent },
			validationSchema: promptUpdateIntentValidationSchema,
		});

	const descriptionId = useId();
	const lastValidIntentReference = useRef(prompt.intent);
	const [isCopyPending, setIsCopyPending] = useState(false);

	const errorMessage = errors.taskIntent?.message;
	const isComposed = Boolean(prompt.isComposed);
	const isOwner = user?.id === prompt.userId && !isComposed;
	const relativeTime = getRelativeTimeLabel(prompt.createdAt);

	const deliveryPath = (
		isComposed
			? configureString(AppRoute.COMPOSED_PROMPTS_$COMPOSED_PROMPT_ID, {
					composedPromptId: String(prompt.id),
				})
			: configureString(AppRoute.PROMPTS_$PROMPT_ID, {
					promptId: String(prompt.id),
				})
	) as NavigableRoute;

	useEffect(() => {
		lastValidIntentReference.current = prompt.intent;
		reset({ taskIntent: prompt.intent });
	}, [prompt.id, prompt.intent, reset]);

	const handleSaveUpdatedIntent = useCallback((): void => {
		if (isComposed) {
			return;
		}

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
						message: PromptHistoryMessage.UPDATE_INTENT_SUCCESS,
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
	}, [handleSubmit, isComposed, prompt.id, queryPayload, reset, updateIntent]);

	const handleCopyPrompt = useCallback((): void => {
		setIsCopyPending(true);
		void navigator.clipboard
			.writeText(prompt.body)
			.then(() => {
				showNotification({
					message: PromptHistoryMessage.COPY_SUCCESS,
					type: NotificationType.SUCCESS,
				});
			})
			.catch(() => {
				showNotification({
					message: PromptHistoryMessage.COPY_FAILURE,
					type: NotificationType.DANGER,
				});
			})
			.finally(() => {
				setIsCopyPending(false);
			});
	}, [prompt.body]);

	const rawScore =
		prompt.computedScore ?? (prompt.score > ZERO_VALUE ? prompt.score : null);
	const formattedScore =
		typeof rawScore === "number" ? +rawScore.toFixed(FRACTION_DIGITS) : null;

	return (
		<article className={styles["panel"]}>
			<div className={styles["heading"]}>
				<div className={styles["title-row"]}>
					{isOwner ? (
						<InlineEdit
							className={styles["intent"]}
							control={control}
							descriptionId={descriptionId}
							isLabelHidden={true}
							label={PromptHistoryLabel.TASK_INTENT}
							name="taskIntent"
							onSave={handleSaveUpdatedIntent}
							size="sm"
						/>
					) : (
						<h2 className={styles["intent"]}>{prompt.intent}</h2>
					)}
					<div className={styles["badges"]}>
						{isComposed && (
							<span className={styles["badge-generated"]}>GENERATED</span>
						)}
						<ScoreBadge
							efficiencyScore={formattedScore}
							label={
								formattedScore === null
									? "Unrated"
									: `${String(formattedScore)}/${String(PromptValidationRule.EFFICIENCY_SCORE_MAX)}`
							}
						/>
					</div>
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
				<Link className={styles["open-link"]} to={deliveryPath}>
					{PromptHistoryLabel.OPEN_FULL_PAGE}
					<Icon
						className={styles["open-link-icon"]}
						iconName={IconName.CHEVRON}
					/>
				</Link>
			</div>

			<pre className={styles["body"]}>{prompt.body}</pre>

			<div className={styles["actions"]}>
				<Button
					className={styles["copy-button"]}
					iconName={IconName.COPY}
					isDisabled={isCopyPending}
					isLoading={isCopyPending}
					label={PromptHistoryLabel.COPY_PROMPT}
					onClick={handleCopyPrompt}
					type="button"
					variant={ButtonVariant.PRIMARY}
				/>
			</div>
		</article>
	);
};

export { PromptDetailPanel };
