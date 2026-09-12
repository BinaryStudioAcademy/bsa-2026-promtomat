import React, { useCallback, useId } from "react";
import { useWatch } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { Select } from "~/libs/components/select/select.js";
import { ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useServerFormErrors } from "~/libs/hooks/use-server-form-errors/use-server-form-errors.hook.js";
import {
	type ComposeRequestDto,
	composeValidationSchema,
} from "~/modules/composed-prompts/composed-prompts.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces.js";

import {
	DEFAULT_GENERATE_PAYLOAD,
	GENERATE_FIELDS,
} from "../../libs/constants/constants.js";
import { GenerateLabel } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

type Properties = {
	error: unknown;
	isLoading: boolean;
	onSubmit: (payload: ComposeRequestDto) => void;
};

const GenerateForm: React.FC<Properties> = ({
	error,
	isLoading,
	onSubmit,
}: Properties) => {
	const workspaceCaptionId = useId();
	const { data: workspacesData } = useGetWorkspacesQuery({});

	const options = workspacesData?.items.map(({ id, name }) => ({
		label: name,
		value: id,
	}));

	const { clearErrors, control, handleSubmit, setError } =
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

	const workspaceId = useWatch({ control, name: "workspaceId" });
	const hasWorkspace = Boolean(workspaceId);

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(onSubmit)(event);
		},
		[handleSubmit, onSubmit],
	);

	return (
		<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
			<div className={styles["workspace-row"]}>
				<span className={styles["workspace-caption"]} id={workspaceCaptionId}>
					{GenerateLabel.WORKSPACE_CAPTION}
				</span>
				<div className={styles["workspace-select"]}>
					<Select
						control={control}
						descriptionId={workspaceCaptionId}
						isDisabled={isLoading}
						isLabelHidden
						label={GenerateLabel.WORKSPACE_FIELD}
						name="workspaceId"
						options={options ?? []}
						placeholder={GenerateLabel.WORKSPACE_PLACEHOLDER}
						size={ControlSize.LG}
					/>
				</div>
			</div>
			<div className={styles["task-zone"]}>
				<Input
					control={control}
					isDisabled={isLoading || !hasWorkspace}
					isLabelHidden
					label={GenerateLabel.DESCRIPTION_FIELD}
					name="description"
					placeholder={GenerateLabel.DESCRIPTION_PLACEHOLDER}
					size={ControlSize.LG}
				/>
				<Button
					className={styles["submit"]}
					isDisabled={!hasWorkspace}
					isLoading={isLoading}
					label={GenerateLabel.SUBMIT}
					size={ControlSize.LG}
					type="submit"
				/>
			</div>
		</form>
	);
};

export { GenerateForm };
