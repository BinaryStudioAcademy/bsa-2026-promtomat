import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { InlineEdit } from "~/libs/components/inline-edit/inline-edit.js";
import { Link } from "~/libs/components/link/link.js";
import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { ScoreBadge } from "~/libs/components/score-badge/score-badge.js";
import { ButtonVariant, IconName } from "~/libs/enums/enums.js";
import {
	getRelativeTimeLabel,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";
import {
	type PromptGetQueryDto,
	type PromptItemResponseDto,
	type PromptUpdateIntentRequestDto,
} from "~/modules/prompts/libs/types/types.js";
import { useUpdateTaskIntentMutation } from "~/modules/prompts/prompts-api.js";
import {
	getPromptRoute,
	getScoreLabel,
	promptUpdateIntentValidationSchema,
} from "~/modules/prompts/prompts.js";

import {
	PromptHistoryLabel,
	PromptHistoryMessage,
} from "../../libs/enums/enum.js";
import styles from "./styles.module.css";

type Properties = {
	prompt: PromptItemResponseDto;
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
	const isOwner = user?.id === prompt.userId;
	const relativeTime = getRelativeTimeLabel(prompt.createdAt);
	const deliveryPath = getPromptRoute(prompt.id);

	useEffect(() => {
		lastValidIntentReference.current = prompt.intent;
		reset({ taskIntent: prompt.intent });
	}, [prompt.id, prompt.intent, reset]);

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
	}, [handleSubmit, prompt.id, queryPayload, reset, updateIntent]);

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
					<ScoreBadge
						efficiencyScore={prompt.score}
						label={getScoreLabel(prompt.score)}
					/>
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
