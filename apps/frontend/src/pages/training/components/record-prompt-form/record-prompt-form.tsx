import React, { useState } from "react";
import { type Control } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { Input } from "~/libs/components/input/input.js";
import { ScoreDescription } from "~/libs/components/score-grid/libs/enums/enums.js";
import { getScoreColor } from "~/libs/components/score-grid/libs/helpers/get-score-color.helper.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { ButtonVariant, ControlSize, IconName } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type PromptCreateRequestDto } from "~/modules/prompts/prompts.js";

import { type PromptBodyMode } from "../../libs/enums/enums.js";
import { PromptBodyField } from "../prompt-body-field/prompt-body-field.js";
import { PromptLabels } from "../prompt-labels/prompt-labels.js";
import { RecordPromptFormMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	canSubmit: boolean;
	control: Control<PromptCreateRequestDto, null>;
	error: unknown;
	isSubmitting: boolean;
	loggedLabel: string | undefined;
	mode: ValueOf<typeof PromptBodyMode>;
	onModeChange: (mode: ValueOf<typeof PromptBodyMode>) => void;
	onScoreSelect: (score: number) => () => void;
	onSubmit: (event: React.BaseSyntheticEvent) => void;
	score: null | number;
};

const RecordPromptForm: React.FC<Properties> = ({
	canSubmit,
	control,
	error,
	isSubmitting,
	loggedLabel,
	mode,
	onModeChange,
	onScoreSelect,
	onSubmit,
	score,
}: Properties) => {
	const [hoveredScore, setHoveredScore] = useState<null | number>(null);

	const describedScore = hoveredScore ?? score;

	return (
		<form className={styles["form"]} noValidate onSubmit={onSubmit}>
			<div className={styles["fields"]}>
				<Input
					control={control}
					isDisabled={isSubmitting}
					label={RecordPromptFormMessage.INTENT_LABEL}
					name="taskIntent"
					placeholder={RecordPromptFormMessage.INTENT_PLACEHOLDER}
					size={ControlSize.LG}
				/>
				<PromptBodyField
					control={control}
					isDisabled={isSubmitting}
					mode={mode}
					onModeChange={onModeChange}
				/>
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
			<div className={styles["actions"]}>
				<Button
					iconName={IconName.CLIPBOARD_CHECK}
					isDisabled={!canSubmit}
					isLoading={isSubmitting}
					label={RecordPromptFormMessage.SUBMIT}
					size={ControlSize.LG}
					type="submit"
					variant={ButtonVariant.ACCENT}
				/>
				<span className={styles["hint"]}>
					{canSubmit
						? RecordPromptFormMessage.SUBMIT_HINT_READY
						: RecordPromptFormMessage.SUBMIT_HINT_INCOMPLETE}
				</span>
			</div>
		</form>
	);
};

export { RecordPromptForm };
