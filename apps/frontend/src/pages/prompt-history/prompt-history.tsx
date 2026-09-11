import React, { useCallback } from "react";

import { Input } from "~/libs/components/input/input.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { Select } from "~/libs/components/select/select.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { usePromptFilters } from "~/modules/prompts/libs/hooks/use-prompt-filters/use-prompt-filters.hook.js";
import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";
import { useGetPromptsQuery } from "~/modules/prompts/prompts-api.js";
import { PromptScope } from "~/modules/prompts/prompts.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces-api.js";

import { PromptListItem } from "./components/prompt-list-item/prompt-list-item.js";
import styles from "./styles.module.css";

const ZERO_VALUE = 0;

const PromptHistory: React.FC = () => {
	const {
		control,
		handlePageChange,
		handleScopeChange,
		handleScoreChange,
		queryPayload,
	} = usePromptFilters();

	const { data: promptsData, isFetching } = useGetPromptsQuery(queryPayload);
	const { data: workspacesData } = useGetWorkspacesQuery({});

	const workspaces = workspacesData?.items ?? [];
	const workspaceOptions = [
		{ label: "All Workspaces", value: "" },
		...workspaces.map(({ id, name }) => ({
			label: name,
			value: id,
		})),
	];

	const items = promptsData?.items ?? [];
	const totalPrompts = promptsData?.totalCount ?? ZERO_VALUE;
	const averageScore = promptsData?.averageScore ?? ZERO_VALUE;
	const hasMore = items.length < totalPrompts;

	const handleMineScopeClick = useCallback((): void => {
		handleScopeChange(PromptScope.MINE);
	}, [handleScopeChange]);

	const handleAllScopeClick = useCallback((): void => {
		handleScopeChange(PromptScope.ALL);
	}, [handleScopeChange]);

	return (
		<main className={styles["container"]}>
			<div className={styles["page-wrapper"]}>
				<header className={styles["header"]}>
					<h1 className={styles["title"]}>Prompt Log History</h1>
					<div className={styles["tabs"]} role="tablist">
						<button
							aria-selected={queryPayload.scope === PromptScope.MINE}
							className={getValidClasses(
								styles["tab"],
								queryPayload.scope === PromptScope.MINE && styles["tab-active"],
							)}
							onClick={handleMineScopeClick}
							role="tab"
							type="button"
						>
							My Injections
						</button>
						<button
							aria-selected={queryPayload.scope === PromptScope.ALL}
							className={getValidClasses(
								styles["tab"],
								queryPayload.scope === PromptScope.ALL && styles["tab-active"],
							)}
							onClick={handleAllScopeClick}
							role="tab"
							type="button"
						>
							Workspace
						</button>
					</div>
				</header>

				<div className={styles["metrics"]}>
					<div className={styles["metric-card"]}>
						<span className={styles["metric-label"]}>Total Prompts</span>
						<span className={styles["metric-value"]}>{totalPrompts}</span>
					</div>
					<div className={styles["metric-card"]}>
						<span className={styles["metric-label"]}>Average Score</span>
						<span className={styles["metric-value"]}>{averageScore} / 10</span>
					</div>
				</div>

				<div className={styles["filters"]}>
					<Input
						control={control}
						label="Search Logs"
						name="search"
						placeholder="Search logs..."
					/>
					<ScoreGrid label="Score:" onScoreSelect={handleScoreChange} />
					<div className={styles["workspace-filter"]}>
						<Select
							control={control}
							label="Workspace:"
							name="workspaceId"
							options={workspaceOptions}
						/>
					</div>
				</div>

				<div className={styles["list"]}>
					{!isFetching && items.length === ZERO_VALUE ? (
						<div className={styles["empty-state"]}>
							No prompts match the current filters.
						</div>
					) : (
						items.map((item: PromptItemResponseDto) => (
							<PromptListItem key={item.id} prompt={item} />
						))
					)}
				</div>

				{hasMore && (
					<button
						className={styles["load-more"]}
						disabled={isFetching}
						onClick={handlePageChange}
						type="button"
					>
						{isFetching ? "Loading..." : "Load More"}
					</button>
				)}
			</div>
		</main>
	);
};

export { PromptHistory };
