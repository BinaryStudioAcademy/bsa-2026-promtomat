import React, { useCallback } from "react";
import { type Control } from "react-hook-form";

import { Input } from "~/libs/components/input/input.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { Select } from "~/libs/components/select/select.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
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
				<div className={styles["input-wrapper"]}>
					<Select
						control={control}
						isDisabled={isSubmitting}
						label="Context"
						name="workspaceId"
						options={options}
						placeholder="Select a workspace"
					/>
					<Input
						control={control}
						isDisabled={isSubmitting}
						label="Task Intent"
						name="taskIntent"
						placeholder="What were you trying to achieve? (e.g., JWT Authentication on FastAPI)"
					/>
					<Textarea
						autoComplete="off"
						control={control}
						isDisabled={isSubmitting}
						label="Prompt Body"
						name="promptBody"
						placeholder="Paste the exact prompt you sent to your &#10;coding AI tool here"
						rows={6}
					/>
					<ScoreGrid
						isDisabled={isSubmitting}
						label="Efficiency Score"
						onScoreSelect={onScoreSelect}
					/>
				</div>
			</form>
		</>
	);
};

export { RecordPromptForm };
