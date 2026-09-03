import { useCallback } from "react";
import { useController } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { type WorkspaceCreateRequestDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useCreateWorkspaceMutation,
	workspaceCreationValidationSchema,
} from "~/modules/workspaces/workspaces.js";

import {
	DEFAULT_WORKSPACE_CREATE_PAYLOAD,
	FIRST_ELEMENT_INDEX,
	WORKSPACE_STACK_TAG_OPTIONS,
} from "./libs/constants.js";
import styles from "./styles.module.css";

type Properties = {
	onClose: () => void;
};

const STACK_TAGS = "stackTags";

const WorkspaceCreateForm = ({ onClose }: Properties): React.JSX.Element => {
	const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

	const { control, handleSubmit } = useAppForm<WorkspaceCreateRequestDto>({
		defaultValues: DEFAULT_WORKSPACE_CREATE_PAYLOAD,
		validationSchema: workspaceCreationValidationSchema,
	});

	const {
		field: stackTagsField,
		fieldState: { error: stackTagsError },
	} = useController({
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
						{WORKSPACE_STACK_TAG_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
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
