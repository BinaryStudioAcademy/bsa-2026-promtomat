import React from "react";
import { type Control } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { Input } from "~/libs/components/input/input.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { Select } from "~/libs/components/select/select.js";
import { ControlSize, IconName } from "~/libs/enums/enums.js";
import { type PromptCreateRequestDto } from "~/modules/prompts/prompts.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces.js";

import { PromptBodyField } from "../prompt-body-field/prompt-body-field.js";
import { PromptLabels } from "../prompt-labels/prompt-labels.js";
import { RecordPromptFormMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	control: Control<PromptCreateRequestDto, null>;
	error: unknown;
	isScoreInvalid: boolean;
	isSubmitting: boolean;
	loggedLabel: string | undefined;
	onScoreSelect: (score: number) => () => void;
	onSubmit: (event: React.BaseSyntheticEvent) => void;
	score: null | number;
};

const RecordPromptForm: React.FC<Properties> = ({
	control,
	error,
	isScoreInvalid,
	isSubmitting,
	loggedLabel,
	onScoreSelect,
	onSubmit,
	score,
}: Properties) => {
	const { data } = useGetWorkspacesQuery({});

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
			<form className={styles["form"]} noValidate onSubmit={onSubmit}>
				<div className={styles["fields"]}>
					<Select
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
							isDisabled={isSubmitting}
							isRadio={true}
							label={RecordPromptFormMessage.SCORE_LABEL}
							onScoreSelect={onScoreSelect}
							selectedScore={score}
						/>
						{isScoreInvalid && (
							<p className={styles["score-error"]} role="alert">
								{RecordPromptFormMessage.SCORE_REQUIRED}
							</p>
						)}
						<p className={styles["note"]}>
							<span className={styles["note-tag"]}>
								{RecordPromptFormMessage.SCORE_NOTE_TAG}
							</span>{" "}
							{RecordPromptFormMessage.SCORE_NOTE}
						</p>
					</div>
				</div>
				<FormAlert error={error} />
				<div className={styles["actions"]}>
					<Button
						iconName={IconName.CHECK}
						isLoading={isSubmitting}
						label={RecordPromptFormMessage.SUBMIT}
						type="submit"
					/>
					<span className={styles["hint"]}>
						{RecordPromptFormMessage.SUBMIT_HINT}
					</span>
				</div>
			</form>
		</>
	);
};

export { RecordPromptForm };
