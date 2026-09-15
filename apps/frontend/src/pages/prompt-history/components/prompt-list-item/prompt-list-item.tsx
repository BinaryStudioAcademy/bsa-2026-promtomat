import React, { useCallback, useId, useState } from "react";
import { useController } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { InlineEdit } from "~/libs/components/inline-edit/inline-edit.js";
import { getScoreColor } from "~/libs/components/score-grid/libs/helpers/get-score-color.helper.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
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
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { copyToClipboard, isCopied } = useClipboard();

	const scoreColorClass = styles[getScoreColor(prompt.score)];
	const relativeTime = getRelativeTimeLabel(prompt.createdAt);

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
	const descriptionId = useId();

	const errorMessage = error?.message;
	const isOwner = user?.id === prompt.userId;

	const handleToggle = useCallback(
		(event: React.SyntheticEvent<HTMLDetailsElement>): void => {
			setIsOpen(event.currentTarget.open);
		},
		[],
	);

	const handleCopyClick = useCallback((): void => {
		void copyToClipboard(prompt.body);
	}, [copyToClipboard, prompt.body]);

	const handleSaveUpdatedIntent = useCallback((): void => {
		void handleSubmit(async (payload: PromptUpdateIntentRequestDto) => {
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
				reset({ taskIntent: prompt.intent });
			}
		})();
	}, [
		handleSubmit,
		updateIntent,
		prompt.id,
		prompt.intent,
		reset,
		queryPayload,
	]);

	return (
		<details className={styles["item"]} onToggle={handleToggle} open={isOpen}>
			<summary className={styles["row"]}>
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
							isOpen && styles["chevron-expanded"],
						)}
					>
						▾
					</span>
				</div>
			</summary>

			<div className={styles["expanded"]}>
				<div className={styles["expanded-header"]}>
					<span className={styles["expanded-label"]}>Prompt Body</span>
					<Button
						className={styles["copy-button"]}
						label={isCopied ? "Copied!" : "Copy"}
						onClick={handleCopyClick}
						size={ControlSize.SM}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
				</div>
				<pre className={styles["body"]}>{prompt.body}</pre>
			</div>
		</details>
	);
};

export { PromptListItem };
