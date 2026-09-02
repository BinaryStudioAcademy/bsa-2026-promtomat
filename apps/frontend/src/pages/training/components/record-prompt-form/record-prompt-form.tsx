import {
	PromptCreateRequestDto,
	promptCreateValidationSchema,
} from "@promptomat/shared";
import React, { useCallback } from "react";

import { Input } from "~/libs/components/input/input.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { Select } from "~/libs/components/select/select.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useRecordPromptMutation } from "~/modules/prompts/prompts-api.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces-api.js";

import styles from "../../styles.module.css";
import { DEFAULT_RECORD_PROMT_PAYLOAD } from "./libs/constants.js";

const RecordPromptForm: React.FC = () => {
	const [recordPrompt] = useRecordPromptMutation();
	const { data } = useGetWorkspacesQuery({});

	const workspaces = data?.items;

	const options = workspaces?.map(({ id, name, visibility }) => {
		const [firstLetter = "", ...restChars] = visibility;
		const capitalizedVisibility =
			firstLetter.toUpperCase() + restChars.join("");
		return {
			label: `${name} (${capitalizedVisibility})`,
			value: id,
		};
	});

	const { control, handleSubmit, reset, setValue } =
		useAppForm<PromptCreateRequestDto>({
			defaultValues: DEFAULT_RECORD_PROMT_PAYLOAD,
			validationSchema: promptCreateValidationSchema,
		});

	const handleScoreSubmit = useCallback(
		(score: number) => {
			return (): void => {
				setValue("efficiencyScore", score);
				void handleSubmit((payload: PromptCreateRequestDto) => {
					void recordPrompt(payload).unwrap();
					reset();
				})();
			};
		},
		[handleSubmit, recordPrompt, setValue, reset],
	);

	return (
		<>
			<div>
				<h1 className={styles["heading"]}>Log This Prompt</h1>
				<span className={styles["sub-heading"]}>
					Every submission trains the retrieval index.
				</span>
			</div>
			<form className={styles["form"]} noValidate>
				<div className={styles["input-wrapper"]}>
					<Select
						control={control}
						label="Context"
						name="workspaceId"
						options={options ?? []}
						placeholder="Select a workspace"
					/>
					<Input
						control={control}
						label="Task Intent"
						name="taskIntent"
						placeholder="What were you trying to achieve? (e.g., JWT Authentication on FastAPI)"
					/>
					<Textarea
						control={control}
						label="Prompt Body"
						name="promptBody"
						placeholder="Paste the exact prompt you sent to your &#10;coding AI tool here..."
					/>
					<ScoreGrid onScoreSelect={handleScoreSubmit} />
				</div>
			</form>
		</>
	);
};

export { RecordPromptForm };
