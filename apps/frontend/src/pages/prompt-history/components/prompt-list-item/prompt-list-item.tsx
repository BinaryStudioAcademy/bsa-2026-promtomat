import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { useController } from "react-hook-form";

import { InlineEdit } from "~/libs/components/inline-edit/inline-edit.js";
import { getScoreColor } from "~/libs/components/score-grid/libs/helpers/get-score-color.helper.js";
import {
	getRelativeTimeLabel,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useClipboard } from "~/libs/hooks/use-clipboard/use-clipboard.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";
import { usePromptFilters } from "~/modules/prompts/libs/hooks/use-prompt-filters/use-prompt-filters.hook.js";
import {
	type PromptItemResponseDto,
	type PromptUpdateIntentRequestDto,
} from "~/modules/prompts/libs/types/types.js";
import { useUpdateTaskIntentMutation } from "~/modules/prompts/prompts-api.js";
import { promptUpdateIntentValidationSchema } from "~/modules/prompts/prompts.js";

import { PromptHistoryMessage } from "../../libs/enums/enum.js";
import styles from "./styles.module.css";

type Properties = {
	prompt: PromptItemResponseDto;
};

const PromptListItem: React.FC<Properties> = ({ prompt }) => {
	const { data: user } = useGetAuthenticatedUserQuery(undefined);
	const [updateIntent] = useUpdateTaskIntentMutation();
	const { control, handleSubmit, reset } =
		useAppForm<PromptUpdateIntentRequestDto>({
			defaultValues: { taskIntent: prompt.intent },
			validationSchema: promptUpdateIntentValidationSchema,
		});

	const {
		fieldState: { error },
	} = useController({
		control,
		name: "taskIntent",
	});

	const { queryPayload } = usePromptFilters();

	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const { copyToClipboard, isCopied } = useClipboard();

	const contentId = useId();
	const descriptionId = useId();

	const scoreColorClass = styles[getScoreColor(prompt.score)];
	const relativeTime = getRelativeTimeLabel(prompt.createdAt);

	const errorMessage = error?.message;
	const isOwner = user?.id === prompt.userId;

	const lastValidIntentReference = useRef(prompt.intent);

	useEffect(() => {
		lastValidIntentReference.current = prompt.intent;
	}, [prompt.intent]);

	const handleToggle = useCallback((): void => {
		setIsExpanded((previous) => !previous);
	}, []);

	const handleRowClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>): void => {
			const target = event.target as HTMLElement;
			if (target.closest("button, input, textarea")) {
				return;
			}
			handleToggle();
		},
		[handleToggle],
	);

	const handleRowKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>): void => {
			if (event.target !== event.currentTarget) {
				return;
			}
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				handleToggle();
			}
		},
		[handleToggle],
	);

	const handleCopyClick = useCallback((): void => {
		void copyToClipboard(prompt.body);
	}, [copyToClipboard, prompt.body]);

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
						type: "success",
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
	}, [handleSubmit, updateIntent, prompt.id, reset, queryPayload]);

	return (
		<div className={styles["item"]}>
			<div
				aria-controls={contentId}
				aria-expanded={isExpanded}
				className={styles["row"]}
				onClick={handleRowClick}
				onKeyDown={handleRowKeyDown}
				role="button"
				tabIndex={0}
			>
				<div
					className={getValidClasses(styles["score-badge"], scoreColorClass)}
				>
					{prompt.score}
				</div>
				<div className={styles["info"]}>
					<InlineEdit
						className={styles["intent"]}
						control={control}
						descriptionId={descriptionId}
						isDisabled={!isOwner}
						isLabelHidden={true}
						label="Task Intent"
						name="taskIntent"
						onSave={handleSaveUpdatedIntent}
						size="sm"
					/>
					<span
						className={
							errorMessage
								? getValidClasses(styles["meta"], styles["error"])
								: styles["meta"]
						}
					>
						{errorMessage ?? (prompt.workspaceName || "No workspace")}
					</span>
				</div>
				<div className={styles["right-controls"]}>
					<span className={styles["timestamp"]}>Injected {relativeTime}</span>
					<span
						className={getValidClasses(
							styles["chevron"],
							isExpanded && styles["chevron-expanded"],
						)}
					>
						▾
					</span>
				</div>
			</div>

			{isExpanded && (
				<div className={styles["expanded"]} id={contentId}>
					<div className={styles["expanded-header"]}>
						<span className={styles["expanded-label"]}>Prompt Body</span>
						<button
							className={styles["copy-button"]}
							onClick={handleCopyClick}
							type="button"
						>
							{isCopied ? "Copied!" : "Copy"}
						</button>
					</div>
					<pre className={styles["body"]}>{prompt.body}</pre>
				</div>
			)}
		</div>
	);
};

export { PromptListItem };
