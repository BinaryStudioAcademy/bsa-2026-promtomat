import React, { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { ScoreGrid } from "~/libs/components/score-grid/score-grid.js";
import { Select } from "~/libs/components/select/select.js";
import { ButtonVariant } from "~/libs/enums/enums.js";
import { usePromptFilters } from "~/modules/prompts/libs/hooks/use-prompt-filters/use-prompt-filters.hook.js";
import { useGetPromptsInfiniteQuery } from "~/modules/prompts/prompts-api.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces-api.js";

import { PromptListItem } from "./components/prompt-list-item/prompt-list-item.js";
import styles from "./styles.module.css";

const ZERO_VALUE = 0;

const PromptHistory: React.FC = () => {
	const { control, handleScoreChange, queryPayload } = usePromptFilters();

	const { data, fetchNextPage, hasNextPage, isFetching } =
		useGetPromptsInfiniteQuery(queryPayload);
	const { data: { items: workspaces = [] } = {} } = useGetWorkspacesQuery({});

	const workspaceOptions = [
		{ label: "All Workspaces", value: "" },
		...workspaces.map(({ id, name }) => ({
			label: name,
			value: id,
		})),
	];

	const items = data?.pages.flatMap((page) => page.items) ?? [];

	const [firstPage] = data?.pages ?? [];
	const totalPrompts = firstPage?.totalCount ?? ZERO_VALUE;
	const averageScore = firstPage?.averageScore ?? null;

	const handleLoadMore = useCallback((): void => {
		void fetchNextPage();
	}, [fetchNextPage]);

	return (
		<main className={styles["container"]}>
			<div className={styles["page-wrapper"]}>
				<header className={styles["header"]}>
					<h1 className={styles["title"]}>Prompt Log History</h1>
				</header>

				<div className={styles["metrics"]}>
					<div className={styles["metric-card"]}>
						<span className={styles["metric-label"]}>Total Prompts</span>
						<span className={styles["metric-value"]}>{totalPrompts}</span>
					</div>
					<div className={styles["metric-card"]}>
						<span className={styles["metric-label"]}>Average Score</span>
						<span className={styles["metric-value"]}>
							{averageScore === null ? "—" : `${String(averageScore)} / 10`}
						</span>
					</div>
				</div>

				<div className={styles["filters"]}>
					<Input
						control={control}
						label="Search Logs"
						name="search"
						placeholder="Search logs..."
					/>
					<ScoreGrid
						isRadio
						label="Efficiency score:"
						onScoreSelect={handleScoreChange}
						selectedScore={
							typeof queryPayload.score === "number" ? queryPayload.score : null
						}
					/>
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
						items.map((item) => <PromptListItem key={item.id} prompt={item} />)
					)}
				</div>

				{hasNextPage && (
					<div className={styles["load-more-wrapper"]}>
						<Button
							isDisabled={isFetching}
							isLoading={isFetching}
							label={isFetching ? "Loading..." : "Load More"}
							onClick={handleLoadMore}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
					</div>
				)}
			</div>
		</main>
	);
};

export { PromptHistory };
