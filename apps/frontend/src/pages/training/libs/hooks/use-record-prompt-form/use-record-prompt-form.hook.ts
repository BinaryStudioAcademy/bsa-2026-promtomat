import { useCallback } from "react";
import { type Control, useWatch } from "react-hook-form";

import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useRecordPromptMutation } from "~/modules/prompts/prompts-api.js";
import {
	type PromptCreateRequestDto,
	promptCreateValidationSchema,
} from "~/modules/prompts/prompts.js";
import { DEFAULT_RECORD_PROMPT_PAYLOAD } from "~/pages/training/libs/constants/constants.js";

type ReturnValue = {
	control: Control<PromptCreateRequestDto, null>;
	isSubmitting: boolean;
	onScoreSelect: (score: number) => () => void;
	workspaceId: number | undefined;
};

const useRecordPromptForm = (): ReturnValue => {
	const [recordPrompt, { isLoading }] = useRecordPromptMutation();

	const { control, handleSubmit, reset, setValue } =
		useAppForm<PromptCreateRequestDto>({
			defaultValues: DEFAULT_RECORD_PROMPT_PAYLOAD,
			validationSchema: promptCreateValidationSchema,
		});

	const selectedWorkspaceId = useWatch({ control, name: "workspaceId" });
	const workspaceId =
		typeof selectedWorkspaceId === "number" ? selectedWorkspaceId : undefined;

	const handleScoreSelect = useCallback(
		(score: number) => {
			return (): void => {
				setValue("efficiencyScore", score);
				void handleSubmit(async (payload: PromptCreateRequestDto) => {
					const { data } = await recordPrompt(payload);

					if (data) {
						reset({
							...DEFAULT_RECORD_PROMPT_PAYLOAD,
							workspaceId: payload.workspaceId,
						});
					}
				})();
			};
		},
		[handleSubmit, recordPrompt, reset, setValue],
	);

	return {
		control,
		isSubmitting: isLoading,
		onScoreSelect: handleScoreSelect,
		workspaceId,
	};
};

export { useRecordPromptForm };
