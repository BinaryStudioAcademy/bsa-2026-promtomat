import { useCallback } from "react";
import { useController } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { SearchableSelect } from "~/libs/components/searchable-select/searchable-select.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
import {
	ButtonVariant,
	ControlSize,
	ErrorCode,
	FormValidationMode,
	TechStackTechDictionary,
} from "~/libs/enums/enums.js";
import { preventLineBreak } from "~/libs/helpers/helpers.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { type WorkspaceCreateRequestDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useCreateWorkspaceMutation,
	workspaceCreationValidationSchema,
	WorkspaceValidationRule,
} from "~/modules/workspaces/workspaces.js";

import { WorkspaceFormMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";
import { DEFAULT_WORKSPACE_CREATE_PAYLOAD } from "./libs/constants/constants.js";

type Properties = {
	onClose: () => void;
};

const STACK_TAGS = "stackTags";

const WorkspaceCreateForm: React.FC<Properties> = ({ onClose }: Properties) => {
	const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();
	const { control, handleSubmit, setError } =
		useAppForm<WorkspaceCreateRequestDto>({
			defaultValues: DEFAULT_WORKSPACE_CREATE_PAYLOAD,
			mode: FormValidationMode.ON_CHANGE,
			validationSchema: workspaceCreationValidationSchema,
		});

	const { field: stackTagsField } = useController({
		control,
		name: STACK_TAGS,
	});

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(async (payload: WorkspaceCreateRequestDto) => {
				const { data, error } = await createWorkspace(payload);
				if (data) {
					onClose();
				}

				if (
					isServerError(error) &&
					error.code === ErrorCode.WORKSPACE_ALREADY_EXISTS
				) {
					setError("name", { message: error.message, type: "server" });
				}
			})(event);
		},
		[createWorkspace, handleSubmit, onClose, setError],
	);

	return (
		<>
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<div className={styles["fields"]}>
					<Input
						control={control}
						label="Workspace name"
						name="name"
						placeholder="Enter name"
					/>
					<Textarea
						control={control}
						label="Description"
						maxLength={WorkspaceValidationRule.DESCRIPTION_MAXIMUM_LENGTH}
						name="description"
						onKeyDown={preventLineBreak}
						placeholder="Enter description"
						rows={2}
					/>

					<SearchableSelect
						control={control}
						isDisabled={isLoading}
						label="Tech Stack Tags"
						name={stackTagsField.name}
						placeholder="Enter tags"
						size={ControlSize.MD}
						valuesDictionary={Object.values(TechStackTechDictionary)}
					/>
				</div>
				<div className={styles["footer"]}>
					<Button
						isDisabled={isLoading}
						label="Close"
						onClick={onClose}
						size={ControlSize.MD}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
					<Button
						isLoading={isLoading}
						label={
							isLoading
								? WorkspaceFormMessage.CREATING
								: WorkspaceFormMessage.CREATE
						}
						size={ControlSize.MD}
						type="submit"
					/>
				</div>
			</form>
		</>
	);
};

export { WorkspaceCreateForm };
