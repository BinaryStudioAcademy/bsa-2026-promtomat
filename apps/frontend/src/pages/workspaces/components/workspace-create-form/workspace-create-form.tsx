import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { type WorkspaceCreateRequestDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useCreateWorkspaceMutation,
	workspaceCreationValidationSchema,
} from "~/modules/workspaces/workspaces.js";

import { WorkspaceFormMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";
import { WorkspaceStackTagsSelect } from "../workspace-stack-tags-select/workspace-stack-tags-select.js";
import { DEFAULT_WORKSPACE_CREATE_PAYLOAD } from "./libs/constants/constants.js";

type Properties = {
	onClose: () => void;
};

const WorkspaceCreateForm: React.FC<Properties> = ({ onClose }: Properties) => {
	const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

	const { control, handleSubmit } = useAppForm<WorkspaceCreateRequestDto>({
		defaultValues: DEFAULT_WORKSPACE_CREATE_PAYLOAD,
		validationSchema: workspaceCreationValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(async (payload: WorkspaceCreateRequestDto) => {
				const { data } = await createWorkspace(payload);
				if (data) {
					onClose();
				}
			})(event);
		},
		[createWorkspace, handleSubmit, onClose],
	);

	return (
		<>
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<div className={styles["fields"]}>
					<Input
						control={control}
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
						label="Close"
						onClick={onClose}
						size={ControlSize.MD}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
					<Button
						isDisabled={isLoading}
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
