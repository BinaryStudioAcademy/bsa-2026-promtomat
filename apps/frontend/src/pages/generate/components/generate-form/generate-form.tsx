import React, { useId } from "react";
import { type Control } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { Select } from "~/libs/components/select/select.js";
import { ControlSize, IconName } from "~/libs/enums/enums.js";
import { type ComposeRequestDto } from "~/modules/composed-prompts/composed-prompts.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

import { GenerateLabel } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

type Properties = {
	control: Control<ComposeRequestDto, null>;
	hasWorkspace: boolean;
	isLoading: boolean;
	onSubmit: (event: React.BaseSyntheticEvent) => void;
	workspaces: WorkspaceListItemDto[];
};

const GenerateForm: React.FC<Properties> = ({
	control,
	hasWorkspace,
	isLoading,
	onSubmit,
	workspaces,
}: Properties) => {
	const workspaceCaptionId = useId();
	const options = workspaces.map(({ id, name }) => ({
		label: name,
		value: id,
	}));

	return (
		<form className={styles["form"]} noValidate onSubmit={onSubmit}>
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
						leadingIconName={IconName.FOLDER}
						name="workspaceId"
						options={options}
						placeholder={GenerateLabel.WORKSPACE_PLACEHOLDER}
						size={ControlSize.LG}
					/>
				</div>
			</div>
			<div className={styles["task-zone"]}>
				<div className={styles["description-field"]}>
					<Input
						control={control}
						isDisabled={isLoading || !hasWorkspace}
						isLabelHidden
						label={GenerateLabel.DESCRIPTION_FIELD}
						name="description"
						placeholder={GenerateLabel.DESCRIPTION_PLACEHOLDER}
						size={ControlSize.LG}
					/>
				</div>
				<Button
					className={styles["submit"]}
					iconName={IconName.SPARKLES}
					isDisabled={!hasWorkspace}
					isLoading={isLoading}
					label={isLoading ? GenerateLabel.SUBMITTING : GenerateLabel.SUBMIT}
					size={ControlSize.LG}
					type="submit"
				/>
			</div>
		</form>
	);
};

export { GenerateForm };
