import { skipToken } from "@reduxjs/toolkit/query";
import React, { useCallback, useMemo } from "react";
import { useWatch } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { Select } from "~/libs/components/select/select.js";
import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize, IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useSyncedFormValue } from "~/libs/hooks/use-synced-form-value/use-synced-form-value.hook.js";
import { PromptHistoryScoreTier } from "~/modules/prompt-history/libs/enums/enums.js";
import { usePromptFilters } from "~/modules/prompts/libs/hooks/use-prompt-filters/use-prompt-filters.hook.js";
import { useGetPromptsInfiniteQuery } from "~/modules/prompts/prompts-api.js";
import {
	useActiveWorkspace,
	useGetWorkspacesQuery,
} from "~/modules/workspaces/workspaces.js";

import { PromptDetailPanel } from "./components/prompt-detail-panel/prompt-detail-panel.js";
import { PromptResultsList } from "./components/prompt-results-list/prompt-results-list.js";
import { PromptHistoryLabel } from "./libs/enums/prompt-history-label.enum.js";
import {
	resolveAverageScoreLabel,
	resolveLoadMoreLabel,
	resolveModeHint,
	resolveResultCountLabel,
} from "./libs/helpers/helpers.js";
import {
	usePromptSelection,
	useUnifiedPromptHistory,
} from "./libs/hooks/hooks.js";
import styles from "./styles.module.css";

const NO_COMPOSED_ITEMS: never[] = [];

const QUALITY_TIER_OPTIONS = [
	{
		label: PromptHistoryLabel.QUALITY_TIER_ALL,
		value: PromptHistoryScoreTier.ALL,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_HIGH,
		value: PromptHistoryScoreTier.HIGH,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_MID,
		value: PromptHistoryScoreTier.MID,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_LOW,
		value: PromptHistoryScoreTier.LOW,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_UNRATED,
		value: PromptHistoryScoreTier.UNRATED,
	},
];

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

	const queryPayload = hasWorkspace
		? {
				limit: filterQueryPayload.limit,
				qualityTier: filterQueryPayload.qualityTier,
				search: filterQueryPayload.search,
				workspaceId,
			}
		: skipToken;

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isError,
		isFetching,
		isLoading,
		refetch,
	} = useGetPromptsInfiniteQuery(queryPayload);

	const workspaceOptions =
		workspaces?.map(({ id, name }) => ({
			label: name,
			value: id,
		})) ?? [];

	const activeWorkspaceName =
		workspaces?.find((workspace) => workspace.id === workspaceId)?.name ?? "";

	const regularItems = useMemo(
		() => data?.pages.flatMap((page) => page.items) ?? [],
		[data?.pages],
	);

	const items = useUnifiedPromptHistory({
		composedItems: NO_COMPOSED_ITEMS,
		qualityTier: filterQueryPayload.qualityTier,
		regularItems,
		workspaceName: activeWorkspaceName,
	});

	const [firstPage] = data?.pages ?? [];
	const totalPrompts = firstPage?.totalCount ?? ZERO_VALUE;
	const averageScore = firstPage?.averageScore ?? null;

	const hasActiveFilters =
		Boolean(search) || Boolean(filterQueryPayload.qualityTier);

	const filterKey = [
		String(workspaceId ?? ""),
		filterQueryPayload.qualityTier ?? "",
		search,
	].join(":");

	const { handleSelectPrompt, selectedPrompt, selectedPromptKey } =
		usePromptSelection({ filterKey, items });

	const handleLoadMore = useCallback((): void => {
		void fetchNextPage();
	}, [fetchNextPage]);

	const handleRetry = useCallback((): void => {
		void refetch();
	}, [refetch]);

	const resultCountLabel = resolveResultCountLabel(items.length);
	const modeHint = resolveModeHint(search);
	const loadMoreLabel = resolveLoadMoreLabel(isFetching, isError);
	const averageScoreLabel = resolveAverageScoreLabel(averageScore);

	const isSearchLayoutEmpty = !selectedPrompt && items.length === ZERO_VALUE;
	const isAverageScoreHidden = averageScore === null;
	const shouldShowLoadMore = hasNextPage && hasWorkspace && !isLoading;

	const detailQueryPayload =
		queryPayload === skipToken ? { workspaceId: ZERO_VALUE } : queryPayload;

	let detailPane: React.ReactNode = null;

	if (selectedPrompt) {
		detailPane = (
			<PromptDetailPanel
				prompt={selectedPrompt}
				queryPayload={detailQueryPayload}
			/>
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
								isAverageScoreHidden && styles["list-metric-hidden"],
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
							label={PromptHistoryLabel.QUALITY_TIER}
							leadingIconName={IconName.SHIELD_CHECK}
							name="qualityTier"
							options={QUALITY_TIER_OPTIONS}
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
						isSearchLayoutEmpty && styles["search-layout-empty"],
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
							queryPayload={detailQueryPayload}
							selectedPromptKey={selectedPromptKey}
						/>
						{shouldShowLoadMore ? (
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
