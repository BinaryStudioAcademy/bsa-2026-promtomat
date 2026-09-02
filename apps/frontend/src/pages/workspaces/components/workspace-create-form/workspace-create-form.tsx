import { useCallback } from "react";
import { useController } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { WorkspaceVisibility } from "~/modules/workspaces/libs/enums/enums.js";
import { type WorkspaceCreateRequestDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useCreateWorkspaceMutation,
	workspaceCreationValidationSchema,
} from "~/modules/workspaces/workspaces.js";

import {
	DEFAULT_WORKSPACE_CREATE_PAYLOAD,
	FIRST_ELEMENT_INDEX,
} from "./libs/constants.js";
import styles from "./styles.module.css";

type Properties = {
	onClose: () => void;
};

const WorkspaceCreateForm = ({ onClose }: Properties): React.JSX.Element => {
	const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

	const { control, handleSubmit } = useAppForm<WorkspaceCreateRequestDto>({
		defaultValues: DEFAULT_WORKSPACE_CREATE_PAYLOAD,
		validationSchema: workspaceCreationValidationSchema,
	});

	const {
		field: visibilityField,
		fieldState: { error: visibilityError },
	} = useController({
		control,
		name: "visibility",
	});

	const {
		field: stackTagsField,
		fieldState: { error: stackTagsError },
	} = useController({
		control,
		name: "stackTags",
	});

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit((payload: WorkspaceCreateRequestDto) => {
				void createWorkspace(payload)
					.unwrap()
					.then(() => {
						onClose();
					})
					.catch((error: unknown) => {
						const { message } = error as { message: string };
						showNotification({ message });
					});
			})(event);
		},
		[createWorkspace, handleSubmit, onClose],
	);

	const handleStackTagsChange = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			stackTagsField.onChange([event.target.value]);
		},
		[stackTagsField],
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

				<div className={styles["field"]}>
					<label className={styles["label"]} htmlFor="visibility-select">
						Visibility
					</label>
					<select
						className={styles["select"]}
						id="visibility-select"
						{...visibilityField}
					>
						<option disabled hidden value={WorkspaceVisibility.PUBLIC}>
							Select an ...
						</option>
						<option value={WorkspaceVisibility.PUBLIC}>Public</option>
						<option value={WorkspaceVisibility.PRIVATE}>Private</option>
					</select>
					<span className={styles["message"]}>{visibilityError?.message}</span>
				</div>

				<div className={styles["field"]}>
					<label className={styles["label"]} htmlFor="stack-tags-select">
						Stack Tags
					</label>
					<select
						className={styles["select"]}
						id="stack-tags-select"
						name={stackTagsField.name}
						onBlur={stackTagsField.onBlur}
						onChange={handleStackTagsChange}
						value={stackTagsField.value[FIRST_ELEMENT_INDEX] || ""}
					>
						<option disabled hidden value="">
							Select an option...
						</option>
						<option value="react">React</option>
						<option value="node">Node.js</option>
						<option value="typescript">TypeScript</option>
					</select>
					<span className={styles["message"]}>{stackTagsError?.message}</span>
				</div>

				<div className={styles["footer"]}>
					<Button isDisabled={isLoading} label="Create" type="submit" />
				</div>
			</form>
		</>
	);
};

export { WorkspaceCreateForm };
