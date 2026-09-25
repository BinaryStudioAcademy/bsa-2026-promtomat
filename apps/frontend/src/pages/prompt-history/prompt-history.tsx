import React, { useCallback, useMemo } from "react";
import { useWatch } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { Select } from "~/libs/components/select/select.js";
import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize, IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useSyncedFormValue } from "~/libs/hooks/use-synced-form-value/use-synced-form-value.hook.js";
import { useGetComposedPromptsQuery } from "~/modules/composed-prompts/composed-prompts-api.js";
import { PromptQualityTier } from "~/modules/prompts/libs/enums/enums.js";
import { usePromptFilters } from "~/modules/prompts/libs/hooks/use-prompt-filters/use-prompt-filters.hook.js";
import { useGetPromptsInfiniteQuery } from "~/modules/prompts/prompts-api.js";
import {
	useActiveWorkspace,
	useGetWorkspacesQuery,
} from "~/modules/workspaces/workspaces.js";
import { AnalyticLabel } from "~/pages/analytics/libs/enums/enums.js";

import { PromptDetailPanel } from "./components/prompt-detail-panel/prompt-detail-panel.js";
import { PromptResultsList } from "./components/prompt-results-list/prompt-results-list.js";
import { PromptHistoryLabel } from "./libs/enums/prompt-history-label.enum.js";
import {
	usePromptSelection,
	useUnifiedPromptHistory,
} from "./libs/hooks/hooks.js";
import styles from "./styles.module.css";

const FRACTION_DIGITS = 1;
const SINGLE_RESULT_COUNT = 1;

const QUALITY_TIER_OPTIONS = [
	{
		label: PromptHistoryLabel.QUALITY_TIER_ALL,
		value: PromptQualityTier.ALL,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_PROVEN,
		value: PromptQualityTier.PROVEN,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_USABLE,
		value: PromptQualityTier.USABLE,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_NEEDS_IMPROVEMENT,
		value: PromptQualityTier.NEEDS_IMPROVEMENT,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_UNRATED,
		value: PromptQualityTier.UNRATED,
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
	const queryPayload = {
		...filterQueryPayload,
		workspaceId: hasWorkspace ? workspaceId : undefined,
	};

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isError: isPromptsError,
		isFetching: isPromptsFetching,
		isLoading: isPromptsLoading,
		refetch: refetchPrompts,
	} = useGetPromptsInfiniteQuery(queryPayload, { skip: !hasWorkspace });

	const {
		data: composedPromptsData,
		isError: isComposedError,
		isFetching: isComposedFetching,
		isLoading: isComposedLoading,
		refetch: refetchComposed,
	} = useGetComposedPromptsQuery(
		{ workspaceId: workspaceId as number },
		{ skip: !hasWorkspace },
	);

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
		composedItems: composedPromptsData?.items ?? [],
		qualityTier: queryPayload.qualityTier,
		regularItems,
		search,
		workspaceName: activeWorkspaceName,
	});

	const [firstPage] = data?.pages ?? [];
	const regularTotalPrompts = firstPage?.totalCount ?? ZERO_VALUE;
	const composedTotalPrompts = composedPromptsData?.totalCount ?? ZERO_VALUE;
	const totalPrompts = regularTotalPrompts + composedTotalPrompts;
	const averageScore = firstPage?.averageScore ?? null;

	const hasActiveFilters = Boolean(search) || Boolean(queryPayload.qualityTier);

	const filterKey = [
		String(queryPayload.workspaceId ?? ""),
		queryPayload.qualityTier ?? "",
		search,
	].join(":");

	const { handleSelectPrompt, selectedPrompt, selectedPromptKey } =
		usePromptSelection({ filterKey, items });

	const isFetching = isPromptsFetching || isComposedFetching;
	const isLoading = isPromptsLoading || isComposedLoading;
	const isError = isPromptsError || isComposedError;

	const handleLoadMore = useCallback((): void => {
		void fetchNextPage();
	}, [fetchNextPage]);

	const handleRetry = useCallback((): void => {
		void refetchPrompts();
		void refetchComposed();
	}, [refetchComposed, refetchPrompts]);

	const resultCountLabel =
		items.length === SINGLE_RESULT_COUNT
			? `${String(items.length)} ${PromptHistoryLabel.RESULT}`
			: `${String(items.length)} ${PromptHistoryLabel.RESULTS}`;

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
			: `${String(+averageScore.toFixed(FRACTION_DIGITS))} ${AnalyticLabel.KPI_AVERAGE_CAPTION}`;

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
							selectedPromptKey={selectedPromptKey}
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
