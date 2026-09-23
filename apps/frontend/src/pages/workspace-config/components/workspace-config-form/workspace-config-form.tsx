import { useCallback, useEffect } from "react";

import { Button } from "~/libs/components/button/button.js";
import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { Input } from "~/libs/components/input/input.js";
import { SearchableSelect } from "~/libs/components/searchable-select/searchable-select.js";
import {
	ControlSize,
	FormValidationMode,
	HTTPCode,
} from "~/libs/enums/enums.js";
import { sortValuesByDictionary } from "~/libs/helpers/helpers.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useServerFormErrors } from "~/libs/hooks/use-server-form-errors/use-server-form-errors.hook.js";
import { checkIsToastedError } from "~/libs/modules/api/libs/helpers/check-is-toasted-error.helper.js";
import { getErrorMessage } from "~/libs/modules/api/libs/helpers/get-error-message.helper.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import {
	type WorkspaceDto,
	type WorkspaceUpdateRequestDto,
} from "~/modules/workspaces/libs/types/types.js";
import {
	useUpdateWorkspaceMutation,
	workspaceUpdateValidationSchema,
	WorkspaceValidationRule,
} from "~/modules/workspaces/workspaces.js";

import { WorkspaceConfigMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";
import {
	TECH_STACK_TAG_VALUES,
	WORKSPACE_CONFIG_FIELDS,
} from "./libs/constants/constants.js";
import { checkIsStackTagsEqual } from "./libs/helpers/check-is-stack-tags-equal/check-is-stack-tags-equal.helper.js";

type Properties = {
	isOwner: boolean;
	workspace: WorkspaceDto;
};

type WorkspaceEditableFields = Pick<
	WorkspaceDto,
	"description" | "name" | "stackTags"
>;

const WorkspaceConfigForm: React.FC<Properties> = ({
	isOwner,
	workspace,
}: Properties) => {
	const {
		clearErrors,
		control,
		formState: { isDirty, isValid },
		handleSubmit,
		reset,
		setError,
		trigger,
	} = useAppForm<WorkspaceEditableFields>({
		defaultValues: {
			description: workspace.description,
			name: workspace.name,
			stackTags: sortValuesByDictionary(
				workspace.stackTags,
				TECH_STACK_TAG_VALUES,
			),
		},
		mode: FormValidationMode.ON_CHANGE,
		validationSchema: workspaceUpdateValidationSchema,
	});

	useEffect(() => {
		void trigger();
	}, [trigger]);

	const [updateWorkspace, { error, isLoading }] = useUpdateWorkspaceMutation();
	const { hasFieldErrors } = useServerFormErrors({
		clearErrors,
		error,
		fields: WORKSPACE_CONFIG_FIELDS,
		setError,
	});

	const errorMessage = getErrorMessage(error);
	const hasConflictError =
		isServerError(error) && error.status === HTTPCode.CONFLICT;
	const generalErrorMessage =
		hasConflictError || hasFieldErrors || checkIsToastedError(error)
			? null
			: errorMessage;

	const isEditingDisabled = isLoading || !isOwner;

	useEffect(() => {
		if (hasConflictError && errorMessage) {
			setError("name", { message: errorMessage, type: "server" });
		}
	}, [errorMessage, hasConflictError, setError]);

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(async (values: WorkspaceEditableFields) => {
				const hasDescriptionChanged =
					values.description !== workspace.description;
				const hasNameChanged = values.name !== workspace.name;
				const hasStackTagsChanged = !checkIsStackTagsEqual(
					values.stackTags,
					workspace.stackTags,
				);

				if (!hasDescriptionChanged && !hasNameChanged && !hasStackTagsChanged) {
					return;
				}

				const payload: WorkspaceUpdateRequestDto = {};

				if (hasDescriptionChanged) {
					payload.description = values.description;
				}

				if (hasNameChanged) {
					payload.name = values.name;
				}

				if (hasStackTagsChanged) {
					payload.stackTags = values.stackTags;
				}

				const { data } = await updateWorkspace({ id: workspace.id, payload });

				if (data) {
					reset({
						description: data.description,
						name: data.name,
						stackTags: sortValuesByDictionary(
							data.stackTags,
							TECH_STACK_TAG_VALUES,
						),
					});
					showNotification({
						message: WorkspaceConfigMessage.SAVE_SUCCESS,
						type: "success",
					});
				}
			})(event);
		},
		[handleSubmit, updateWorkspace, workspace, reset],
	);

	return (
		<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
			<div className={styles["fields"]}>
				{generalErrorMessage && <FormAlert message={generalErrorMessage} />}
				<Input
					control={control}
					isDisabled={isEditingDisabled}
					label="Workspace name"
					name="name"
					placeholder="Enter name"
				/>
				<Input
					control={control}
					isDisabled={isEditingDisabled}
					label="Description"
					maxLength={WorkspaceValidationRule.DESCRIPTION_MAXIMUM_LENGTH}
					name="description"
					placeholder="Enter description"
				/>
				<SearchableSelect
					control={control}
					isDisabled={isEditingDisabled}

					label="Tech Stack Tags"
					name="stackTags"
					placeholder="Enter tags"
					size={ControlSize.MD}
					valuesDictionary={TECH_STACK_TAG_VALUES}
				/>
			</div>
			{isOwner && (
				<div className={styles["footer"]}>
					<Button
						isDisabled={!isDirty || !isValid}
						isLoading={isLoading}
						label={
							isLoading
								? WorkspaceConfigMessage.SAVING
								: WorkspaceConfigMessage.SAVE
						}
						size={ControlSize.MD}
						type="submit"
					/>
				</div>
			)}
		</form>
	);
};

export { WorkspaceConfigForm };
