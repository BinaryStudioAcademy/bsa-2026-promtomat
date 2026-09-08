import { skipToken } from "@reduxjs/toolkit/query";
import React, { useCallback } from "react";
import { useWatch } from "react-hook-form";

import { Input } from "~/libs/components/input/input.js";
import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { Select } from "~/libs/components/select/select.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import {
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useRecordPromptMutation,
} from "~/modules/prompts/prompts-api.js";
import {
	type PromptCreateRequestDto,
	promptCreateValidationSchema,
} from "~/modules/prompts/prompts.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces-api.js";

import styles from "../../styles.module.css";
import { RecentInjections } from "../recent-injections/recent-injections.js";
import { DEFAULT_RECORD_PROMT_PAYLOAD } from "./libs/constants.js";

const RecordPromptForm: React.FC = () => {
	const [recordPrompt, { isLoading }] = useRecordPromptMutation();
	const { data } = useGetWorkspacesQuery({});

	const workspaces = data?.items;

	const options = workspaces?.map(({ id, name }) => {
		return {
			label: name,
			value: id,
		};
	});

	const { control, handleSubmit, reset, setValue } =
		useAppForm<PromptCreateRequestDto>({
			defaultValues: DEFAULT_RECORD_PROMT_PAYLOAD,
			validationSchema: promptCreateValidationSchema,
		});

	const workspaceId = useWatch({ control, name: "workspaceId" });
	const workspaceQuery =
		typeof workspaceId === "number" ? { workspaceId } : skipToken;
	const { data: progress } = useGetPromptProgressQuery(workspaceQuery);
	const { data: recent } = useGetPromptRecentQuery(workspaceQuery);

	const handleScoreSubmit = useCallback(
		(score: number) => {
			return (): void => {
				setValue("efficiencyScore", score);
				void handleSubmit(async (payload: PromptCreateRequestDto) => {
					const { data } = await recordPrompt(payload);
					if (data) {
						reset({
							...DEFAULT_RECORD_PROMT_PAYLOAD,
							workspaceId: payload.workspaceId,
						});
					}
				})();
			};
		},
		[handleSubmit, recordPrompt, setValue, reset],
	);

	const handleFormSubmit = useCallback(
		(event: React.SubmitEvent<HTMLFormElement>) => {
			event.preventDefault();
		},
		[],
	);

	return (
		<>
			{progress && (
				<ProgressBar
					count={progress.count}
					label="Training progress"
					target={progress.target}
					unit="Prompts"
				/>
			)}
			<div>
				<h1 className={styles["heading"]}>Log This Prompt</h1>
				<span className={styles["sub-heading"]}>
					Every submission trains the retrieval index.
				</span>
			</div>
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<div className={styles["input-wrapper"]}>
					<Select
						control={control}
						isDisabled={isLoading}
						label="Context"
						name="workspaceId"
						options={options ?? []}
						placeholder="Select a workspace"
					/>
					<Input
						control={control}
						isDisabled={isLoading}
						label="Task Intent"
						name="taskIntent"
						placeholder="What were you trying to achieve? (e.g., JWT Authentication on FastAPI)"
					/>
					<Textarea
						autoComplete="off"
						control={control}
						isDisabled={isLoading}
						label="Prompt Body"
						name="promptBody"
						placeholder="Paste the exact prompt you sent to your &#10;coding AI tool here..."
						rows={6}
					/>
					<ScoreGrid
						isDisabled={isLoading}
						label="Efficiency Score"
						onScoreSelect={handleScoreSubmit}
					/>
				</div>
			</form>
			{recent && <RecentInjections items={recent.items} />}
		</>
	);
};

export { RecordPromptForm };
