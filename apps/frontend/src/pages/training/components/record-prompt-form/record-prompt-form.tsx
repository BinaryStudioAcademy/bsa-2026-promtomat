import React, { useCallback } from "react";
import { type Control } from "react-hook-form";

import { Input } from "~/libs/components/input/input.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { Select } from "~/libs/components/select/select.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
import { ControlSize } from "~/libs/enums/enums.js";
import { type PromptCreateRequestDto } from "~/modules/prompts/prompts.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces-api.js";

import { RecordPromptFormMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	control: Control<PromptCreateRequestDto, null>;
	isSubmitting: boolean;
	onScoreSelect: (score: number) => () => void;
};

const RecordPromptForm: React.FC<Properties> = ({
	control,
	isSubmitting,
	onScoreSelect,
}: Properties) => {
	const { data } = useGetWorkspacesQuery({});

	const options =
		data?.items.map(({ id, name }) => {
			return {
				label: name,
				value: id,
			};
		}) ?? [];

	const handleFormSubmit = useCallback(
		(event: React.SubmitEvent<HTMLFormElement>) => {
			event.preventDefault();
		},
		[],
	);

	return (
		<>
			<header className={styles["header"]}>
				<p className={styles["eyebrow"]}>{RecordPromptFormMessage.EYEBROW}</p>
				<h1 className={styles["title"]}>{RecordPromptFormMessage.TITLE}</h1>
				<p className={styles["subtitle"]}>{RecordPromptFormMessage.SUBTITLE}</p>
			</header>
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
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
					<Textarea
						autoComplete="off"
						control={control}
						isDisabled={isSubmitting}
						label={RecordPromptFormMessage.BODY_LABEL}
						name="promptBody"
						placeholder={RecordPromptFormMessage.BODY_PLACEHOLDER}
						rows={8}
					/>
					<ScoreGrid
						isDisabled={isSubmitting}
						label={RecordPromptFormMessage.SCORE_LABEL}
						onScoreSelect={onScoreSelect}
					/>
				</div>
			</form>
		</>
	);
};

export { RecordPromptForm };
