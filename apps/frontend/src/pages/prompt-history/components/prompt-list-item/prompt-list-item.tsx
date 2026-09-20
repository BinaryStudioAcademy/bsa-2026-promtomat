import React, { useCallback, useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";

import { InlineEdit } from "~/libs/components/inline-edit/inline-edit.js";
import { getScoreColor } from "~/libs/components/score-grid/libs/helpers/get-score-color.helper.js";
import { AppRoute } from "~/libs/enums/enums.js";
import {
	configureString,
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
import { promptUpdateIntentValidationSchema } from "~/modules/prompts/prompts.js";

import { PromptHistoryMessage } from "../../libs/enums/enum.js";
import styles from "./styles.module.css";

type Properties = {
	prompt: PromptItemResponseDto;
	queryPayload: Omit<PromptGetQueryDto, "page">;
};

const PromptListItem: React.FC<Properties> = ({
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

	const errorMessage = errors.taskIntent?.message;
	const isOwner = user?.id === prompt.userId;

	useEffect(() => {
		lastValidIntentReference.current = prompt.intent;
	}, [prompt.intent]);

	const scoreColorClass = styles[getScoreColor(prompt.score)];
	const relativeTime = getRelativeTimeLabel(prompt.createdAt);
	const deliveryPath = configureString(AppRoute.PROMPTS_$PROMPT_ID, {
		promptId: String(prompt.id),
	});

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
		<Link className={styles["item"]} to={deliveryPath}>
			<div className={styles["row"]}>
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
				</div>
			</div>
		</Link>
	);
};

export { PromptListItem };
