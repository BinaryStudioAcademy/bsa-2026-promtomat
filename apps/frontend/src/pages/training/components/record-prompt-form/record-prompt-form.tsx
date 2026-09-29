import React, { useState } from "react";
import { type Control, useWatch } from "react-hook-form";

import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { Input } from "~/libs/components/input/input.js";
import { ScoreDescription } from "~/libs/components/score-grid/libs/enums/enums.js";
import { getScoreColor } from "~/libs/components/score-grid/libs/helpers/get-score-color.helper.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { Select } from "~/libs/components/select/select.js";
import { ControlSize } from "~/libs/enums/enums.js";
import { type PromptCreateRequestDto } from "~/modules/prompts/prompts.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces.js";

import { PromptBodyField } from "../prompt-body-field/prompt-body-field.js";
import { PromptLabels } from "../prompt-labels/prompt-labels.js";
import { WorkspaceChip } from "../workspace-chip/workspace-chip.js";
import { RecordPromptFormMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	control: Control<PromptCreateRequestDto, null>;
	error: unknown;
	isSubmitting: boolean;
	loggedLabel: string | undefined;
	onScoreSelect: (score: number) => () => void;
	score: null | number;
};

const RecordPromptForm: React.FC<Properties> = ({
	control,
	error,
	isSubmitting,
	loggedLabel,
	onScoreSelect,
	score,
}: Properties) => {
	const [hoveredScore, setHoveredScore] = useState<null | number>(null);

	const describedScore = hoveredScore ?? score;

	const { data } = useGetWorkspacesQuery({});
	const selectedWorkspaceId = useWatch({ control, name: "workspaceId" });

	const selectedWorkspace = data?.items.find(
		({ id }) => id === selectedWorkspaceId,
	);
	const workspaceChip = selectedWorkspace ? (
		<WorkspaceChip name={selectedWorkspace.name} />
	) : null;

	const options =
		data?.items.map(({ id, name }) => {
			return {
				label: name,
				value: id,
			};
		}) ?? [];

	return (
		<>
			<header className={styles["header"]}>
				<p className={styles["eyebrow"]}>{RecordPromptFormMessage.EYEBROW}</p>
				<h1 className={styles["title"]}>{RecordPromptFormMessage.TITLE}</h1>
				<p className={styles["subtitle"]}>{RecordPromptFormMessage.SUBTITLE}</p>
			</header>
			<form className={styles["form"]} noValidate>
				<div className={styles["fields"]}>
					<Select
						adornment={workspaceChip}
						control={control}
						isDisabled={isSubmitting}
						label={RecordPromptFormMessage.WORKSPACE_LABEL}
						name="workspaceId"
						options={options}
						placeholder={RecordPromptFormMessage.WORKSPACE_PLACEHOLDER}
						size={ControlSize.LG}
					/>
					<Input
						control={control}
						isDisabled={isSubmitting}
						label={RecordPromptFormMessage.INTENT_LABEL}
						name="taskIntent"
						placeholder={RecordPromptFormMessage.INTENT_PLACEHOLDER}
						size={ControlSize.LG}
					/>
					<PromptBodyField control={control} isDisabled={isSubmitting} />
					<PromptLabels label={loggedLabel} />
					<div className={styles["score-field"]}>
						<ScoreGrid
							isDescriptionHidden={true}
							isDisabled={isSubmitting}
							isRadio={true}
							label={RecordPromptFormMessage.SCORE_LABEL}
							onScoreHover={setHoveredScore}
							onScoreSelect={onScoreSelect}
							selectedScore={score}
						/>
						<p aria-live="polite" className={styles["note"]}>
							{describedScore === null ? (
								<>
									<span className={styles["note-tag"]}>
										{RecordPromptFormMessage.SCORE_NOTE_TAG}
									</span>{" "}
									{RecordPromptFormMessage.SCORE_NOTE}
								</>
							) : (
								<span className={styles[getScoreColor(describedScore)]}>
									{ScoreDescription[describedScore]}
								</span>
							)}
						</p>
					</div>
				</div>
				<FormAlert error={error} />
			</form>
		</>
	);
};

export { RecordPromptForm };
