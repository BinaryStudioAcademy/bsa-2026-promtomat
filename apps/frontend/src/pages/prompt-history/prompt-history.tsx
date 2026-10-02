import { skipToken } from "@reduxjs/toolkit/query";
import React, { useCallback, useMemo } from "react";
import { useWatch } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { PageContainer } from "~/libs/components/page-container/page-container.js";
import { PageIntro } from "~/libs/components/page-intro/page-intro.js";
import { PromptDetailPanel } from "~/libs/components/prompt-detail-panel/prompt-detail-panel.js";
import { ScoreValue } from "~/libs/components/score-value/score-value.js";
import { Select } from "~/libs/components/select/select.js";
import { StatCard } from "~/libs/components/stat-card/stat-card.js";
import { StatGrid } from "~/libs/components/stat-grid/stat-grid.js";
import { SCORE_SCALE_CAPTION, ZERO_VALUE } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize, IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useSyncedFormValue } from "~/libs/hooks/use-synced-form-value/use-synced-form-value.hook.js";
import { usePromptFilters } from "~/modules/prompts/libs/hooks/use-prompt-filters/use-prompt-filters.hook.js";
import { useGetPromptsInfiniteQuery } from "~/modules/prompts/prompts-api.js";
import {
	useActiveWorkspace,
	useGetWorkspacesQuery,
} from "~/modules/workspaces/workspaces.js";

import { PromptResultsList } from "./components/prompt-results-list/prompt-results-list.js";
import { QUALITY_TIER_OPTIONS } from "./libs/constants/constants.js";
import { PromptHistoryLabel } from "./libs/enums/enums.js";
import {
	mapPromptToHistoryItem,
	resolveLoadMoreLabel,
	resolveModeHint,
	resolveResultCountLabel,
} from "./libs/helpers/helpers.js";
import { usePromptSelection } from "./libs/hooks/hooks.js";
import styles from "./styles.module.css";

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

	const items = useMemo(
		() =>
			data?.pages
				.flatMap((page) => page.items)
				.map((item) => mapPromptToHistoryItem(item)) ?? [],
		[data?.pages],
	);

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

	const isSearchLayoutEmpty = !selectedPrompt && items.length === ZERO_VALUE;
	const shouldShowLoadMore = hasNextPage && hasWorkspace && !isLoading;

	let detailPane: React.ReactNode = null;

	if (selectedPrompt) {
		detailPane = <PromptDetailPanel prompt={selectedPrompt} />;
	} else if (items.length > ZERO_VALUE) {
		detailPane = (
			<div className={styles["empty-selection"]}>
				{PromptHistoryLabel.EMPTY_SELECTION}
			</div>
		);
	}

	return (
		<PageContainer>
			<div className={styles["page-wrapper"]}>
				<header className={styles["intro"]}>
					<PageIntro
						description={PromptHistoryLabel.DESCRIPTION}
						label={PromptHistoryLabel.EYEBROW}
						title={PromptHistoryLabel.SUBTITLE}
					/>
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

				<StatGrid label={PromptHistoryLabel.METRICS}>
					<StatCard
						caption={PromptHistoryLabel.PROMPTS_LOGGED_CAPTION}
						label={PromptHistoryLabel.PROMPTS_LOGGED}
					>
						<span className={styles["accent"]}>{totalPrompts}</span>
					</StatCard>
					<StatCard
						caption={averageScore === null ? undefined : SCORE_SCALE_CAPTION}
						label={PromptHistoryLabel.AVERAGE_SCORE}
					>
						<ScoreValue score={averageScore} />
					</StatCard>
				</StatGrid>

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
		</PageContainer>
	);
};

export { PromptHistory };
