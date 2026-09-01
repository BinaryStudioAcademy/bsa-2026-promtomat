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

import styles from "../../styles.module.css";
import { DEFAULT_RECORD_PROMT_PAYLOAD } from "./libs/constants.js";

const RecordPromptForm: React.FC = () => {
	const [recordPrompt] = useRecordPromptMutation();

	const { control, handleSubmit } = useAppForm<PromptCreateRequestDto>({
		defaultValues: DEFAULT_RECORD_PROMT_PAYLOAD,
		validationSchema: promptCreateValidationSchema,
	});

	const handleScoreSubmit = useCallback(
		(score: number) => {
			return (): void => {
				void handleSubmit((payload: PromptCreateRequestDto) => {
					void recordPrompt({
						...payload,
						efficiencyScore: score,
					});
				})();
			};
		},
		[handleSubmit, recordPrompt],
	);

	return (
		<>
			<h1 className={styles["heading"]}>Log This Prompt</h1>
			<form className={styles["form"]} noValidate>
				<div className={styles["input-wrapper"]}>
					<Select
						control={control}
						label="Context"
						name="workspaceId"
						options={[]}
					/>
					<Input
						control={control}
						label="Task Intent"
						name="taskIntent"
						placeholder="What you were thying to achive?"
					/>
					<Textarea
						control={control}
						label="Prompt Body"
						name="promptBody"
						placeholder="Paste the exact prompt you sent to your coding AI tool here..."
					/>
					<ScoreGrid onScoreSelect={handleScoreSubmit} />
				</div>
			</form>
		</>
	);
};

export { RecordPromptForm };
