import React, { useCallback } from "react";
import { type Control, useWatch } from "react-hook-form";

import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { useRecordPromptMutation } from "~/modules/prompts/prompts-api.js";
import {
	type PromptCreateRequestDto,
	promptCreateValidationSchema,
} from "~/modules/prompts/prompts.js";
import { DEFAULT_RECORD_PROMPT_PAYLOAD } from "~/pages/training/libs/constants/constants.js";
import { RecordPromptMessage } from "~/pages/training/libs/enums/enums.js";

type ReturnValue = {
	control: Control<PromptCreateRequestDto, null>;
	error: unknown;
	isScoreInvalid: boolean;
	isSubmitting: boolean;
	onScoreSelect: (score: number) => () => void;
	onSubmit: (event: React.BaseSyntheticEvent) => void;
	score: null | number;
	workspaceId: number | undefined;
};

const useRecordPromptForm = (): ReturnValue => {
	const [recordPrompt, { error, isLoading }] = useRecordPromptMutation();

	const { control, errors, handleSubmit, reset, setValue } =
		useAppForm<PromptCreateRequestDto>({
			defaultValues: DEFAULT_RECORD_PROMPT_PAYLOAD,
			validationSchema: promptCreateValidationSchema,
		});

	const selectedScore = useWatch({ control, name: "efficiencyScore" });
	const selectedWorkspaceId = useWatch({ control, name: "workspaceId" });

	const score = typeof selectedScore === "number" ? selectedScore : null;
	const workspaceId =
		typeof selectedWorkspaceId === "number" ? selectedWorkspaceId : undefined;

	const handleScoreSelect = useCallback(
		(nextScore: number) => {
			return (): void => {
				setValue("efficiencyScore", nextScore, { shouldValidate: true });
			};
		},
		[setValue],
	);

	const handleSubmitPrompt = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(async (payload: PromptCreateRequestDto) => {
				const { data } = await recordPrompt(payload);

				if (data) {
					reset({
						...DEFAULT_RECORD_PROMPT_PAYLOAD,
						workspaceId: payload.workspaceId,
					});
					showNotification({
						message: RecordPromptMessage.SUCCESS,
						type: "success",
					});
				}
			})(event);
		},
		[handleSubmit, recordPrompt, reset],
	);

	return {
		control,
		error,
		isScoreInvalid: Boolean(errors.efficiencyScore),
		isSubmitting: isLoading,
		onScoreSelect: handleScoreSelect,
		onSubmit: handleSubmitPrompt,
		score,
		workspaceId,
	};
};

export { useRecordPromptForm };
