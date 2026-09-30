import React, { useCallback, useRef } from "react";
import { type Control, useWatch } from "react-hook-form";

import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useServerFormErrors } from "~/libs/hooks/use-server-form-errors/use-server-form-errors.hook.js";
import { useSyncedFormValue } from "~/libs/hooks/use-synced-form-value/use-synced-form-value.hook.js";
import { useWorkspaceSearchParameter } from "~/libs/hooks/use-workspace-search-parameter/use-workspace-search-parameter.hook.js";
import { checkIsValidationError } from "~/libs/modules/api/libs/helpers/check-is-validation-error.helper.js";
import {
	type ComposeRequestDto,
	type ComposeResponseDto,
	composeValidationSchema,
	useComposeMutation,
} from "~/modules/composed-prompts/composed-prompts.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useActiveWorkspace,
	useGetWorkspacesQuery,
} from "~/modules/workspaces/workspaces.js";

import {
	DEFAULT_GENERATE_PAYLOAD,
	GENERATE_FIELDS,
} from "../../constants/constants.js";
import {
	checkIsRecomposeLimitError,
	checkIsSameComposeRequest,
} from "../../helpers/helpers.js";

type ReturnValue = {
	control: Control<ComposeRequestDto, null>;
	handleDiscard: () => void;
	handleRecompose: () => void;
	handleRetry: () => void;
	handleSubmit: (event: React.BaseSyntheticEvent) => void;
	hasFailure: boolean;
	hasWorkspace: boolean;
	isLoading: boolean;
	result: ComposeResponseDto | undefined;
	workspaces: WorkspaceListItemDto[];
};

const useGenerateForm = (): ReturnValue => {
	const [compose, { data, error, isLoading, reset }] = useComposeMutation();
	const { data: workspacesData } = useGetWorkspacesQuery({});
	const lastPayloadReference = useRef<ComposeRequestDto | null>(null);

	const { clearErrors, control, handleSubmit, setError, setValue } =
		useAppForm<ComposeRequestDto>({
			defaultValues: DEFAULT_GENERATE_PAYLOAD,
			validationSchema: composeValidationSchema,
		});

	useServerFormErrors({
		clearErrors,
		error,
		fields: GENERATE_FIELDS,
		setError,
	});

	const selectedWorkspaceId = useWatch({ control, name: "workspaceId" });
	const hasWorkspace = Boolean(selectedWorkspaceId);
	const formWorkspaceId =
		typeof selectedWorkspaceId === "number" ? selectedWorkspaceId : undefined;

	const activeWorkspaceId = useActiveWorkspace({
		formWorkspaceId,
		workspaces: workspacesData?.items,
	});

	useSyncedFormValue({
		name: "workspaceId",
		setValue,
		value: activeWorkspaceId,
	});

	const handleWorkspaceSelect = useCallback(
		(workspaceId: number): void => {
			setValue("workspaceId", workspaceId);
		},
		[setValue],
	);

	useWorkspaceSearchParameter({
		selectWorkspace: handleWorkspaceSelect,
		workspaces: workspacesData?.items,
	});

	const handleCompose = useCallback(
		async (payload: ComposeRequestDto): Promise<void> => {
			lastPayloadReference.current = payload;

			const composed = await compose(payload);

			if ("error" in composed && checkIsRecomposeLimitError(composed.error)) {
				void compose({ ...payload, shouldRecompose: false });
			}
		},
		[compose],
	);

	const handleSubmitCompose = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(handleCompose)(event);
		},
		[handleCompose, handleSubmit],
	);

	const handleRecompose = useCallback((): void => {
		void handleSubmit((payload) => {
			const shouldRecompose = checkIsSameComposeRequest(
				lastPayloadReference.current,
				payload,
			);

			return handleCompose({ ...payload, shouldRecompose });
		})();
	}, [handleCompose, handleSubmit]);

	const handleRetry = useCallback((): void => {
		if (lastPayloadReference.current) {
			void handleCompose(lastPayloadReference.current);
		}
	}, [handleCompose]);

	const hasFailure =
		error !== undefined &&
		!checkIsValidationError(error) &&
		!checkIsRecomposeLimitError(error);

	return {
		control,
		handleDiscard: reset,
		handleRecompose,
		handleRetry,
		handleSubmit: handleSubmitCompose,
		hasFailure,
		hasWorkspace,
		isLoading,
		result: data,
		workspaces: workspacesData?.items ?? [],
	};
};

export { useGenerateForm };
