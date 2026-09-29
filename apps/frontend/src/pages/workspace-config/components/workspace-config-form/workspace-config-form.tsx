import { useCallback, useEffect } from "react";
import { useWatch } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { Input } from "~/libs/components/input/input.js";
import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { getProgressPercentage } from "~/libs/components/progress-bar/libs/helpers/helpers.js";
import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { SearchableSelect } from "~/libs/components/searchable-select/searchable-select.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
import {
	ControlSize,
	FormValidationMode,
	HTTPCode,
} from "~/libs/enums/enums.js";
import {
	getValidClasses,
	preventLineBreak,
	sortValuesByDictionary,
} from "~/libs/helpers/helpers.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useServerFormErrors } from "~/libs/hooks/use-server-form-errors/use-server-form-errors.hook.js";
import { checkIsServerError } from "~/libs/modules/api/libs/helpers/check-is-server-error.helper.js";
import { checkIsToastedError } from "~/libs/modules/api/libs/helpers/check-is-toasted-error.helper.js";
import { getErrorMessage } from "~/libs/modules/api/libs/helpers/get-error-message.helper.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useUpdateWorkspaceMutation,
	WorkspaceTargets,
	WorkspaceValidationRule,
} from "~/modules/workspaces/workspaces.js";

import {
	WorkspaceConfigLabel,
	WorkspaceConfigMessage,
} from "../../libs/enums/enums.js";
import { workspaceEditableFieldsValidationSchema } from "../../libs/validation-schemas/validation-schemas.js";
import styles from "../../styles.module.css";
import {
	TECH_STACK_TAG_VALUES,
	WORKSPACE_CONFIG_FIELDS,
	WORKSPACE_DATASET_TARGET_OPTIONS,
} from "./libs/constants/constants.js";
import { getWorkspaceUpdatePayload } from "./libs/helpers/get-workspace-update-payload/get-workspace-update-payload.helper.js";
import { type WorkspaceEditableFields } from "./libs/types/types.js";

type Properties = {
	isOwner: boolean;
	workspace: WorkspaceListItemDto;
};

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
		setValue,
		trigger,
	} = useAppForm<WorkspaceEditableFields>({
		defaultValues: {
			datasetTarget: workspace.datasetTarget,
			description: workspace.description,
			name: workspace.name,
			stackTags: sortValuesByDictionary(
				workspace.stackTags,
				TECH_STACK_TAG_VALUES,
			),
		},
		mode: FormValidationMode.ON_TOUCHED,
		validationSchema: workspaceEditableFieldsValidationSchema,
	});

	useEffect(() => {
		void trigger();
	}, [trigger]);

	const datasetTarget = useWatch({ control, name: "datasetTarget" });
	const progressPercentage = Math.round(
		getProgressPercentage(workspace.promptCount, datasetTarget),
	);

	const [updateWorkspace, { error, isLoading }] = useUpdateWorkspaceMutation();
	const { hasFieldErrors } = useServerFormErrors({
		clearErrors,
		error,
		fields: WORKSPACE_CONFIG_FIELDS,
		setError,
	});

	const errorMessage = getErrorMessage(error);
	const hasConflictError =
		checkIsServerError(error) && error.status === HTTPCode.CONFLICT;
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

	const handleNameBlur = useCallback(
		(event: React.FocusEvent<HTMLInputElement>): void => {
			setValue("name", event.target.value.trim(), { shouldDirty: true });
		},
		[setValue],
	);

	const handleDescriptionBlur = useCallback(
		(event: React.FocusEvent<HTMLTextAreaElement>): void => {
			setValue("description", event.target.value.trim(), {
				shouldDirty: true,
			});
		},
		[setValue],
	);

	const handleDatasetTargetChange = useCallback(
		(target: ValueOf<typeof WorkspaceTargets>) => {
			return (): void => {
				setValue("datasetTarget", target, {
					shouldDirty: true,
					shouldValidate: true,
				});
			};
		},
		[setValue],
	);

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(async (values: WorkspaceEditableFields) => {
				const payload = getWorkspaceUpdatePayload(values, {
					datasetTarget: workspace.datasetTarget,
					description: workspace.description,
					name: workspace.name,
					stackTags: workspace.stackTags,
				});

				if (!payload) {
					return;
				}

				const { data: savedWorkspace } = await updateWorkspace({
					id: workspace.id,
					payload,
				});

				if (savedWorkspace) {
					reset({
						datasetTarget: savedWorkspace.datasetTarget,
						description: savedWorkspace.description,
						name: savedWorkspace.name,
						stackTags: sortValuesByDictionary(
							savedWorkspace.stackTags,
							TECH_STACK_TAG_VALUES,
						),
					});
					showNotification({
						message: WorkspaceConfigMessage.SAVE_SUCCESS,
						type: NotificationType.SUCCESS,
					});
				}
			})(event);
		},
		[handleSubmit, updateWorkspace, workspace, reset],
	);

	return (
		<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
			<section className={styles["card"]}>
				<h3 className={styles["section-title"]}>
					{WorkspaceConfigLabel.GENERAL}
				</h3>
				<div className={styles["fields"]}>
					{generalErrorMessage && <FormAlert message={generalErrorMessage} />}
					<Input
						control={control}
						isDisabled={isEditingDisabled}
						label="Workspace name"
						name="name"
						onBlur={handleNameBlur}
						placeholder="Enter name"
					/>
					<Textarea
						control={control}
						isDisabled={isEditingDisabled}
						label="Description"
						maxLength={WorkspaceValidationRule.DESCRIPTION_MAXIMUM_LENGTH}
						name="description"
						onBlur={handleDescriptionBlur}
						onKeyDown={preventLineBreak}
						placeholder="Enter description"
						rows={2}
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
			</section>

			<section className={styles["card"]}>
				<h3 className={styles["section-title"]}>
					{WorkspaceConfigLabel.DATASET_TARGET}
				</h3>
				<div className={styles["target-summary"]}>
					<span className={styles["target-reached"]}>
						{`${String(progressPercentage)}% ${WorkspaceConfigLabel.OF_TARGET_REACHED}`}
					</span>
					<span className={styles["target-count"]}>
						{`${workspace.promptCount.toLocaleString("en-US")} / ${datasetTarget.toLocaleString("en-US")}`}
					</span>
				</div>
				<ProgressBar
					count={workspace.promptCount}
					isSummaryHidden
					label={WorkspaceConfigLabel.DATASET_TARGET}
					target={datasetTarget}
				/>
				<fieldset className={styles["target-field"]}>
					<legend className={styles["target-hint"]}>
						{WorkspaceConfigLabel.DATASET_TARGET_HINT}
					</legend>
					<div className={styles["target-options"]}>
						{WORKSPACE_DATASET_TARGET_OPTIONS.map((target) => (
							<button
								aria-pressed={datasetTarget === target}
								className={getValidClasses(
									styles["target-option"],
									datasetTarget === target && styles["target-option-selected"],
								)}
								disabled={isEditingDisabled}
								key={target}
								onClick={handleDatasetTargetChange(target)}
								type="button"
							>
								{target}
							</button>
						))}
					</div>
				</fieldset>
			</section>

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
