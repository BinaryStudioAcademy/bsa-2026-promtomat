import React, { useCallback, useMemo } from "react";
import { useWatch } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { Select } from "~/libs/components/select/select.js";
import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize, IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useSyncedFormValue } from "~/libs/hooks/use-synced-form-value/use-synced-form-value.hook.js";
import { PromptValidationRule } from "~/modules/prompts/libs/enums/enums.js";
import { usePromptFilters } from "~/modules/prompts/libs/hooks/use-prompt-filters/use-prompt-filters.hook.js";
import { useGetPromptsInfiniteQuery } from "~/modules/prompts/prompts-api.js";
import {
	useActiveWorkspace,
	useGetWorkspacesQuery,
} from "~/modules/workspaces/workspaces.js";
import { AnalyticLabel } from "~/pages/analytics/libs/enums/enums.js";

import { PromptDetailPanel } from "./components/prompt-detail-panel/prompt-detail-panel.js";
import { PromptResultsList } from "./components/prompt-results-list/prompt-results-list.js";
import { PromptHistoryLabel } from "./libs/enums/enum.js";
import { usePromptSelection } from "./libs/hooks/use-prompt-selection/use-prompt-selection.hook.js";
import styles from "./styles.module.css";

const SINGLE_RESULT_COUNT = 1;
const SCORE_OPTION_START = PromptValidationRule.EFFICIENCY_SCORE_MIN;
const SCORE_OPTION_COUNT =
	PromptValidationRule.EFFICIENCY_SCORE_MAX -
	SCORE_OPTION_START +
	SINGLE_RESULT_COUNT;

const PromptHistory: React.FC = () => {
	const {
		control,
		handleClearFilters,
		queryPayload: filterQueryPayload,
		search,
		setValue,
	} = usePromptFilters();

	const { data: workspacesData, isLoading: isLoadingWorkspaces } =
		useGetWorkspacesQuery({});
	const workspaces = workspacesData?.items;
	const formWorkspaceId =
		useWatch({ control, name: "workspaceId" }) ?? undefined;
	const workspaceId = useActiveWorkspace({
		formWorkspaceId:
			typeof formWorkspaceId === "number" ? formWorkspaceId : undefined,
		workspaces,
	});
	useSyncedFormValue({ name: "workspaceId", setValue, value: workspaceId });

	const hasWorkspace = typeof workspaceId === "number";
	const queryPayload = {
		...filterQueryPayload,
		workspaceId: hasWorkspace ? workspaceId : undefined,
	};
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isError,
		isFetching,
		isLoading,
		refetch,
	} = useGetPromptsInfiniteQuery(queryPayload, { skip: !hasWorkspace });

	const workspaceOptions =
		workspaces?.map(({ id, name }) => ({
			label: name,
			value: id,
		})) ?? [];

	const scoreOptions = useMemo(() => {
		const scores = Array.from({ length: SCORE_OPTION_COUNT }, (_, index) => {
			const score = SCORE_OPTION_START + index;

			return {
				label: `${String(score)} / ${String(PromptValidationRule.EFFICIENCY_SCORE_MAX)}`,
				value: score,
			};
		});

		return [
			{ label: PromptHistoryLabel.ANY_SCORE, value: "" },
			...scores.toReversed(),
		];
	}, []);

	const items = data?.pages.flatMap((page) => page.items) ?? [];
	const [firstPage] = data?.pages ?? [];
	const totalPrompts = firstPage?.totalCount ?? ZERO_VALUE;
	const averageScore = firstPage?.averageScore ?? null;
	const hasActiveFilters =
		Boolean(search) || typeof queryPayload.score === "number";

	const filterKey = [
		String(queryPayload.workspaceId ?? ""),
		String(queryPayload.score ?? ""),
		search,
	].join(":");

	const { handleSelectPrompt, selectedPrompt, selectedPromptId } =
		usePromptSelection({ filterKey, items });

	const handleLoadMore = useCallback((): void => {
		void fetchNextPage();
	}, [fetchNextPage]);

	const handleRetry = useCallback((): void => {
		void refetch();
	}, [refetch]);

	const resultCountLabel =
		totalPrompts === SINGLE_RESULT_COUNT
			? `${String(totalPrompts)} ${PromptHistoryLabel.RESULT}`
			: `${String(totalPrompts)} ${PromptHistoryLabel.RESULTS}`;

	const modeHint = search
		? PromptHistoryLabel.HINT_SEARCH
		: PromptHistoryLabel.HINT_BROWSE;

	let loadMoreLabel: string = PromptHistoryLabel.LOAD_MORE;

	if (isFetching) {
		loadMoreLabel = PromptHistoryLabel.LOADING;
	} else if (isError) {
		loadMoreLabel = PromptHistoryLabel.RETRY;
	}

	const averageScoreLabel =
		averageScore === null
			? "—"
			: `${String(averageScore)} ${AnalyticLabel.KPI_AVERAGE_CAPTION}`;

	let detailPane: React.ReactNode = null;

	if (selectedPrompt) {
		detailPane = (
			<PromptDetailPanel prompt={selectedPrompt} queryPayload={queryPayload} />
		);
	} else if (items.length > ZERO_VALUE) {
		detailPane = (
			<div className={styles["empty-selection"]}>
				{PromptHistoryLabel.EMPTY_SELECTION}
			</div>
		);
	}

	return (
		<div className={styles["container"]}>
			<div className={styles["page-wrapper"]}>
				<header className={styles["intro"]}>
					<div className={styles["copy"]}>
						<p className={styles["eyebrow"]}>{PromptHistoryLabel.EYEBROW}</p>
						<h2 className={styles["title"]}>{PromptHistoryLabel.SUBTITLE}</h2>
					</div>
					<div className={styles["workspace"]}>
						<Select
							control={control}
							isDisabled={!workspaces}
							label={PromptHistoryLabel.WORKSPACE}
							leadingIconName={IconName.FOLDER}
							name="workspaceId"
							options={workspaceOptions}
							placeholder={PromptHistoryLabel.WORKSPACE}
							size={ControlSize.LG}
						/>
					</div>
				</header>

				<div className={styles["metrics"]}>
					<div className={styles["metric-card"]}>
						<span className={styles["metric-label"]}>
							{PromptHistoryLabel.PROMPTS_LOGGED}
						</span>
						<span className={styles["metric-value"]}>{totalPrompts}</span>
					</div>
					<div className={styles["metric-card"]}>
						<span className={styles["metric-label"]}>
							{PromptHistoryLabel.AVERAGE_SCORE}
						</span>
						<span
							className={getValidClasses(
								styles["metric-value"],
								styles["metric-score"],
							)}
						>
							{averageScoreLabel}
						</span>
					</div>
				</div>

				<div className={styles["filters"]}>
					<div className={styles["search"]}>
						<Input
							control={control}
							iconName={IconName.SEARCH}
							isLabelHidden
							label={PromptHistoryLabel.SEARCH}
							name="search"
							placeholder={PromptHistoryLabel.SEARCH_PLACEHOLDER}
							size={ControlSize.LG}
						/>
					</div>
					<div className={styles["score-filter"]}>
						<Select
							control={control}
							isLabelHidden
							label={PromptHistoryLabel.EFFICIENCY_SCORE}
							leadingIconName={IconName.SHIELD_CHECK}
							name="score"
							options={scoreOptions}
							size={ControlSize.LG}
						/>
					</div>
				</div>

				<div className={styles["results-bar"]}>
					<span className={styles["result-count"]}>{resultCountLabel}</span>
					<span className={styles["result-hint"]}>{modeHint}</span>
					<Button
						label={PromptHistoryLabel.CLEAR}
						onClick={handleClearFilters}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
				</div>

				<div
					className={getValidClasses(
						styles["search-layout"],
						!selectedPrompt &&
							items.length === ZERO_VALUE &&
							styles["search-layout-empty"],
					)}
				>
					<div className={styles["results"]}>
						<PromptResultsList
							hasActiveFilters={hasActiveFilters}
							hasWorkspace={hasWorkspace}
							isError={isError}
							isFetching={isFetching}
							isLoadingPrompts={isLoading}
							isLoadingWorkspaces={isLoadingWorkspaces}
							items={items}
							onRetry={handleRetry}
							onSelectPrompt={handleSelectPrompt}
							queryPayload={queryPayload}
							selectedPromptId={selectedPromptId}
						/>
						{hasNextPage && hasWorkspace && !isLoading ? (
							<div className={styles["load-more-wrapper"]}>
								<Button
									isDisabled={isFetching}
									isLoading={isFetching}
									label={loadMoreLabel}
									onClick={handleLoadMore}
									type="button"
									variant={ButtonVariant.SECONDARY}
								/>
							</div>
						) : null}
					</div>

					{detailPane ? (
						<div className={styles["desktop-detail"]}>{detailPane}</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export { PromptHistory };
