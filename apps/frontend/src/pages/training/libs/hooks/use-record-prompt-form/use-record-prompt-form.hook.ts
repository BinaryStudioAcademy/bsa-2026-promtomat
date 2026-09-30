import React, { useCallback, useEffect, useMemo, useState } from "react";
import { type Control, useWatch } from "react-hook-form";
import { useLocation } from "react-router-dom";

import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { type SelectOption } from "~/libs/components/select/libs/types/types.js";
import { FormValidationMode } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useSyncedFormValue } from "~/libs/hooks/use-synced-form-value/use-synced-form-value.hook.js";
import { useWorkspaceSearchParameter } from "~/libs/hooks/use-workspace-search-parameter/use-workspace-search-parameter.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { type ValueOf } from "~/libs/types/types.js";
import { checkIsPromptForkDraft } from "~/modules/prompts/libs/helpers/check-is-prompt-fork-draft.helper.js";
import { useRecordPromptMutation } from "~/modules/prompts/prompts-api.js";
import {
	type PromptCreateRequestDto,
	promptCreateValidationSchema,
} from "~/modules/prompts/prompts.js";
import {
	useActiveWorkspace,
	useGetWorkspacesQuery,
} from "~/modules/workspaces/workspaces.js";

import { DEFAULT_RECORD_PROMPT_PAYLOAD } from "../../constants/constants.js";
import { PromptBodyMode, RecordPromptMessage } from "../../enums/enums.js";

type ReturnValue = {
	control: Control<PromptCreateRequestDto, null>;
	error: unknown;
	isSubmitting: boolean;
	loggedLabel: string | undefined;
	mode: ValueOf<typeof PromptBodyMode>;
	onModeChange: (mode: ValueOf<typeof PromptBodyMode>) => void;
	onScoreSelect: (score: number) => () => void;
	score: null | number;
	workspaceId: number | undefined;
	workspaceOptions: SelectOption[];
};

const useRecordPromptForm = (): ReturnValue => {
	const [mode, setMode] = useState<ValueOf<typeof PromptBodyMode>>(
		PromptBodyMode.WRITE,
	);

	const [recordPrompt, { data: loggedPrompt, error, isLoading }] =
		useRecordPromptMutation();

	const { control, handleSubmit, reset, setValue } =
		useAppForm<PromptCreateRequestDto>({
			defaultValues: DEFAULT_RECORD_PROMPT_PAYLOAD,
			mode: FormValidationMode.ON_TOUCHED,
			validationSchema: promptCreateValidationSchema,
		});

	const { data: workspaces } = useGetWorkspacesQuery({});

	const workspaceOptions = useMemo(
		() =>
			workspaces?.items.map(({ id, name }) => {
				return {
					label: name,
					value: id,
				};
			}) ?? [],
		[workspaces],
	);

	const location = useLocation();

	useEffect(() => {
		if (!checkIsPromptForkDraft(location.state)) {
			return;
		}

		reset({
			...DEFAULT_RECORD_PROMPT_PAYLOAD,
			promptBody: location.state.promptBody,
			taskIntent: location.state.taskIntent,
		});
	}, [location.key, location.state, reset]);

	const selectedScore = useWatch({ control, name: "efficiencyScore" }) as
		number | undefined;

	const selectedWorkspaceId = useWatch({ control, name: "workspaceId" });

	const score = selectedScore ?? null;

	const formWorkspaceId =
		typeof selectedWorkspaceId === "number" ? selectedWorkspaceId : undefined;

	const workspaceId = useActiveWorkspace({
		formWorkspaceId,
		workspaces: workspaces?.items,
	});

	useSyncedFormValue({ name: "workspaceId", setValue, value: workspaceId });

	const handleWorkspaceSelect = useCallback(
		(requestedWorkspaceId: number): void => {
			setValue("workspaceId", requestedWorkspaceId);
		},
		[setValue],
	);

	useWorkspaceSearchParameter({
		selectWorkspace: handleWorkspaceSelect,
		workspaces: workspaces?.items,
	});

	const handleSubmitPrompt = useCallback(
		(event?: React.BaseSyntheticEvent): void => {
			void handleSubmit(async (payload: PromptCreateRequestDto) => {
				const { data } = await recordPrompt(payload);

				if (data) {
					reset({
						...DEFAULT_RECORD_PROMPT_PAYLOAD,
						workspaceId: payload.workspaceId,
					});
					setMode(PromptBodyMode.WRITE);
					showNotification({
						message: RecordPromptMessage.SUCCESS,
						type: NotificationType.SUCCESS,
					});
				}
			})(event);
		},
		[handleSubmit, recordPrompt, reset],
	);

	const handleScoreSelect = useCallback(
		(nextScore: number) => {
			return (): void => {
				setValue("efficiencyScore", nextScore, { shouldValidate: true });
				handleSubmitPrompt();
			};
		},
		[handleSubmitPrompt, setValue],
	);

	return {
		control,
		error,
		isSubmitting: isLoading,
		loggedLabel: loggedPrompt?.label,
		mode,
		onModeChange: setMode,
		onScoreSelect: handleScoreSelect,
		score,
		workspaceId,
		workspaceOptions,
	};
};

export { useRecordPromptForm };
