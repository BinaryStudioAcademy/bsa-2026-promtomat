import { useCallback, useEffect } from "react";
import { type FieldPath, useFormState } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import {
	ButtonVariant,
	ControlSize,
	ErrorCode,
	HTTPCode,
} from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useServerFormErrors } from "~/libs/hooks/use-server-form-errors/use-server-form-errors.hook.js";
import { getErrorMessage } from "~/libs/modules/api/libs/helpers/get-error-message.helper.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import {
	type WorkspaceDto,
	type WorkspaceUpdateRequestDto,
} from "~/modules/workspaces/libs/types/types.js";
import {
	useUpdateWorkspaceMutation,
	workspaceUpdateValidationSchema,
} from "~/modules/workspaces/workspaces.js";
import { FormAlert } from "~/pages/auth/components/form-alert/form-alert.js";

import { WorkspaceFormMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";
import { WorkspaceStackTagsSelect } from "../workspace-stack-tags-select/workspace-stack-tags-select.js";
import { checkAreStackTagsEqual } from "./libs/helpers/check-are-stack-tags-equal.helper.js";

type Properties = {
	onClose: () => void;
	workspace: WorkspaceDto;
};

type WorkspaceEditableFields = Pick<WorkspaceDto, "name" | "stackTags">;

const WORKSPACE_CONFIG_FIELDS: FieldPath<WorkspaceEditableFields>[] = [
	"name",
	"stackTags",
];

const WorkspaceConfigForm: React.FC<Properties> = ({
	onClose,
	workspace,
}: Properties) => {
	const { clearErrors, control, handleSubmit, setError } =
		useAppForm<WorkspaceEditableFields>({
			defaultValues: {
				name: workspace.name,
				stackTags: [...workspace.stackTags],
			},
			mode: "onChange",
			validationSchema: workspaceUpdateValidationSchema,
		});

	const [updateWorkspace, { error, isLoading }] = useUpdateWorkspaceMutation();
	const { isDirty, isValid } = useFormState({ control });
	const { hasFieldErrors } = useServerFormErrors({
		clearErrors,
		error,
		fields: WORKSPACE_CONFIG_FIELDS,
		setError,
	});

	const errorMessage = getErrorMessage(error);
	const hasConflictError =
		isServerError(error) && error.status === HTTPCode.CONFLICT;
	const isToastedError =
		isServerError(error) && error.code === ErrorCode.INTERNAL_SERVER_ERROR;
	const generalErrorMessage =
		hasConflictError || hasFieldErrors || isToastedError ? null : errorMessage;

	useEffect(() => {
		if (hasConflictError && errorMessage !== null) {
			setError("name", { message: errorMessage, type: "server" });
		}
	}, [errorMessage, hasConflictError, setError]);

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(async (values: WorkspaceEditableFields) => {
				const hasNameChanged = values.name !== workspace.name;
				const hasStackTagsChanged = !checkAreStackTagsEqual(
					values.stackTags,
					workspace.stackTags,
				);

				if (!hasNameChanged && !hasStackTagsChanged) {
					return;
				}

				const payload: WorkspaceUpdateRequestDto = {};

				if (hasNameChanged) {
					payload.name = values.name;
				}

				if (hasStackTagsChanged) {
					payload.stackTags = values.stackTags;
				}

				const { data } = await updateWorkspace({ id: workspace.id, payload });

				if (data) {
					onClose();
				}
			})(event);
		},
		[handleSubmit, onClose, updateWorkspace, workspace],
	);

	return (
		<>
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<div className={styles["fields"]}>
					{generalErrorMessage !== null && (
						<FormAlert message={generalErrorMessage} />
					)}
					<Input
						control={control}
						isDisabled={isLoading}
						label="Workspace name"
						name="name"
						placeholder="Name..."
					/>
					<WorkspaceStackTagsSelect
						control={control}
						isDisabled={isLoading}
						name="stackTags"
					/>
				</div>
				<div className={styles["footer"]}>
					<Button
						isDisabled={isLoading}
						label="Cancel"
						onClick={onClose}
						size={ControlSize.MD}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
					<Button
						isDisabled={!isDirty || !isValid || isLoading}
						label={
							isLoading
								? WorkspaceFormMessage.SAVING
								: WorkspaceFormMessage.SAVE
						}
						size={ControlSize.MD}
						type="submit"
					/>
				</div>
			</form>
		</>
	);
};

export { WorkspaceConfigForm };
