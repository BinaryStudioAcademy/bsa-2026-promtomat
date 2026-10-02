import { useCallback, useState } from "react";
import { useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PageContainer } from "~/libs/components/page-container/page-container.js";
import { SegmentedControl } from "~/libs/components/segmented-control/segmented-control.js";
import { Select } from "~/libs/components/select/select.js";
import {
	EMPTY_LENGTH,
	WORKSPACE_ID_SEARCH_PARAMETER,
} from "~/libs/constants/constants.js";
import {
	AppRoute,
	ButtonVariant,
	ControlSize,
	FormValidationMode,
	IconName,
} from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useSearch } from "~/libs/hooks/use-search/use-search.hook.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useGetWorkspacesQuery,
	WorkspaceListScope,
	WorkspaceListSort,
} from "~/modules/workspaces/workspaces.js";

import { WorkspaceCard } from "./components/workspace-card/workspace-card.js";
import { WorkspaceCreateModal } from "./components/workspace-create-modal/workspace-create-modal.js";
import { WorkspaceHeader } from "./components/workspace-header/workspace-header.js";
import { WorkspaceStats } from "./components/workspace-stats/workspace-stats.js";
import {
	WORKSPACE_LIST_SCOPE_OPTIONS,
	WORKSPACE_LIST_SORT_OPTIONS,
} from "./libs/constants/constants.js";
import {
	WorkspaceListLabel,
	WorkspaceListMessage,
} from "./libs/enums/enums.js";
import {
	getWorkspaceCollectionStats,
	getWorkspaceListEmptyMessage,
	getWorkspaceOpenDestination,
} from "./libs/helpers/helpers.js";
import { type ActiveModal } from "./libs/types/types.js";
import styles from "./styles.module.css";

const SEARCH_DELAY_MS = 300;

type SortFormPayload = {
	sort: ValueOf<typeof WorkspaceListSort>;
};

const Workspaces: React.FC = () => {
	const navigate = useNavigate();
	const { control, debouncedSearch, resetSearch } = useSearch(SEARCH_DELAY_MS);
	const [scope, setScope] = useState<ValueOf<typeof WorkspaceListScope>>(
		WorkspaceListScope.ALL,
	);
	const { control: sortControl, reset: resetSort } =
		useAppForm<SortFormPayload>({
			defaultValues: { sort: WorkspaceListSort.TOP_ACTIVITY },
			mode: FormValidationMode.ON_CHANGE,
		});
	const sort = useWatch({ control: sortControl, name: "sort" });
	const { currentData, isError, isFetching } = useGetWorkspacesQuery({
		scope,
		sort,
		workspaceName: debouncedSearch,
	});
	const { currentData: collection } = useGetWorkspacesQuery({ scope });
	const workspaces = currentData?.items ?? [];
	const collectionStats = collection
		? getWorkspaceCollectionStats(collection.items)
		: null;
	const isListLoading = isFetching && !currentData;
	const isListEmpty = workspaces.length === EMPTY_LENGTH;
	const hasActiveFilter =
		Boolean(debouncedSearch) || scope !== WorkspaceListScope.ALL;
	const hasLoadError = !isListLoading && isError && isListEmpty;
	const hasNoMatches =
		!isListLoading && !isError && isListEmpty && hasActiveFilter;
	const hasWorkspaces = !isListLoading && !isError && !isListEmpty;
	const emptyMessage = getWorkspaceListEmptyMessage({
		scope,
		search: debouncedSearch,
	});

	const [activeModal, setActiveModal] = useState<ActiveModal>(null);

	const handleCreateOpen = useCallback((): void => {
		setActiveModal({ type: "create" });
	}, []);

	const handleConfigOpen = useCallback(
		(workspace: WorkspaceListItemDto): void => {
			void navigate(
				configureString(AppRoute.WORKSPACES_$WORKSPACE_ID_CONFIG, {
					workspaceId: String(workspace.id),
				}),
			);
		},
		[navigate],
	);

	const handleOpen = useCallback(
		(workspace: WorkspaceListItemDto): void => {
			const destination = getWorkspaceOpenDestination(workspace);
			const searchParameters = new URLSearchParams({
				[WORKSPACE_ID_SEARCH_PARAMETER]: String(workspace.id),
			});

			void navigate({
				pathname: destination,
				search: searchParameters.toString(),
			});
		},
		[navigate],
	);

	const handleModalClose = useCallback((): void => {
		setActiveModal(null);
	}, []);

	const handleClearFilters = useCallback((): void => {
		resetSearch();
		setScope(WorkspaceListScope.ALL);
		resetSort({ sort: WorkspaceListSort.TOP_ACTIVITY });
	}, [resetSearch, resetSort]);

	return (
		<PageContainer>
			<WorkspaceHeader onCreate={handleCreateOpen} />

			{collectionStats && (
				<WorkspaceStats
					averageScore={collectionStats.averageScore}
					promptCount={collectionStats.promptCount}
					workspaceCount={collectionStats.workspaceCount}
				/>
			)}

			<div className={styles["filters"]}>
				<div className={styles["search"]}>
					<Input
						className={styles["search-input"]}
						control={control}
						iconName={IconName.SEARCH}
						isLabelHidden
						isMessageHidden
						label="Search"
						name="search"
						placeholder="Search workspaces"
					/>
				</div>
				<div className={styles["controls"]}>
					<SegmentedControl
						className={styles["scope"]}
						label="Filter workspaces by ownership"
						onChange={setScope}
						options={WORKSPACE_LIST_SCOPE_OPTIONS}
						value={scope}
					/>
					<div className={styles["sort"]}>
						<Select
							className={styles["sort-select"]}
							control={sortControl}
							fieldClassName={styles["sort-field"]}
							isLabelHidden
							isMessageHidden
							label={WorkspaceListLabel.SORT}
							leadingIconName={IconName.SORT}
							name="sort"
							options={[...WORKSPACE_LIST_SORT_OPTIONS]}
							size={ControlSize.LG}
						/>
					</div>
					<Button
						className={styles["clear"]}
						label={WorkspaceListLabel.CLEAR}
						onClick={handleClearFilters}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
				</div>
			</div>
			{isListLoading && <Loader variant={LoaderVariant.SECTION} />}

			<div className={styles["list"]}>
				{hasLoadError && (
					<div className={styles["empty-state"]}>
						<p className={styles["empty-state-text"]}>
							{WorkspaceListMessage.LOAD_ERROR}
						</p>
					</div>
				)}
				{hasNoMatches && (
					<div className={styles["empty-state"]}>
						<p className={styles["empty-state-text"]}>{emptyMessage}</p>
					</div>
				)}
				{hasWorkspaces &&
					workspaces.map((workspace) => {
						return (
							<WorkspaceCard
								key={workspace.id}
								onConfig={handleConfigOpen}
								onOpen={handleOpen}
								workspace={workspace}
							/>
						);
					})}
			</div>

			{activeModal?.type === "create" && (
				<WorkspaceCreateModal onClose={handleModalClose} />
			)}
		</PageContainer>
	);
};

export { Workspaces };
