import { useCallback } from "react";
import { useController } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { type WorkspaceCreateRequestDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useCreateWorkspaceMutation,
	workspaceCreationValidationSchema,
} from "~/modules/workspaces/workspaces.js";

import { TechStackTagsInput } from "../tech-stack-tags-input/tech-stack-tags-input.js";
import { DEFAULT_WORKSPACE_CREATE_PAYLOAD } from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties = {
	onClose: () => void;
};

const STACK_TAGS = "stackTags";

const WorkspaceCreateForm: React.FC<Properties> = ({ onClose }: Properties) => {
	const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

	const { control, handleSubmit } = useAppForm<WorkspaceCreateRequestDto>({
		defaultValues: DEFAULT_WORKSPACE_CREATE_PAYLOAD,
		validationSchema: workspaceCreationValidationSchema,
	});

	const { field: stackTagsField } = useController({
		control,
		name: STACK_TAGS,
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
			{isLoading && <Loader variant={LoaderVariant.SECTION} />}
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<Input
					control={control}
					label="Workspace name"
					name="name"
					placeholder="Name..."
				/>
				<TechStackTagsInput
					control={control}
					label="Add tags"
					name={stackTagsField.name}
				/>
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
						label="Create"
						size={ControlSize.MD}
						type="submit"
					/>
				</div>
			</form>
		</>
	);
};

export { WorkspaceCreateForm };
