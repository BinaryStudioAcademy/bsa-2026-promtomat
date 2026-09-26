import { skipToken } from "@reduxjs/toolkit/query";
import React, { useCallback, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useLocation } from "react-router-dom";

import { Input } from "~/libs/components/input/input.js";
import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { Select } from "~/libs/components/select/select.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useSyncedFormValue } from "~/libs/hooks/use-synced-form-value/use-synced-form-value.hook.js";
import { useWorkspaceSearchParameter } from "~/libs/hooks/use-workspace-search-parameter/use-workspace-search-parameter.hook.js";
import { isPromptForkDraft } from "~/modules/prompts/libs/helpers/is-prompt-fork-draft.helper.js";
import {
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useRecordPromptMutation,
} from "~/modules/prompts/prompts-api.js";
import {
	type PromptCreateRequestDto,
	promptCreateValidationSchema,
} from "~/modules/prompts/prompts.js";
import {
	useActiveWorkspace,
	useGetWorkspacesQuery,
} from "~/modules/workspaces/workspaces.js";

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
	const location = useLocation();

	useEffect(() => {
		if (!isPromptForkDraft(location.state)) {
			return;
		}

		reset({
			...DEFAULT_RECORD_PROMT_PAYLOAD,
			promptBody: location.state.promptBody,
			taskIntent: location.state.taskIntent,
		});
	}, [location.key, location.state, reset]);

	const formWorkspaceId = useWatch({ control, name: "workspaceId" });
	const workspaceId = useActiveWorkspace({ formWorkspaceId, workspaces });
	useSyncedFormValue({ name: "workspaceId", setValue, value: workspaceId });
	useWorkspaceSearchParameter({
		selectWorkspace: (selectedWorkspaceId): void => {
			setValue("workspaceId", selectedWorkspaceId);
		},
		workspaces,
	});

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
				/>
			)}
			<div>
				<h2 className={styles["heading"]}>Log This Prompt</h2>
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
						placeholder="Paste the exact prompt you sent to your &#10;coding AI tool here"
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
