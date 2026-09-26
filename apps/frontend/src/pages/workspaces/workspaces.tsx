import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "~/libs/components/input/input.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { SegmentedControl } from "~/libs/components/segmented-control/segmented-control.js";
import {
	EMPTY_LENGTH,
	WORKSPACE_ID_SEARCH_PARAMETER,
} from "~/libs/constants/constants.js";
import { AppRoute, IconName } from "~/libs/enums/enums.js";
import { configureString, getValidClasses } from "~/libs/helpers/helpers.js";
import { useSearch } from "~/libs/hooks/use-search/use-search.hook.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useGetWorkspacesQuery,
	WorkspaceListScope,
} from "~/modules/workspaces/workspaces.js";

import { WorkspaceCard } from "./components/workspace-card/workspace-card.js";
import { WorkspaceCreateModal } from "./components/workspace-create-modal/workspace-create-modal.js";
import { WorkspaceHeader } from "./components/workspace-header/workspace-header.js";
import { WORKSPACE_LIST_SCOPE_OPTIONS } from "./libs/constants/constants.js";
import { WorkspaceListMessage } from "./libs/enums/enums.js";
import { getWorkspaceOpenDestination } from "./libs/helpers/helpers.js";
import { type ActiveModal } from "./libs/types/types.js";
import styles from "./styles.module.css";

const SEARCH_DELAY_MS = 300;

const Workspaces: React.FC = () => {
	const navigate = useNavigate();
	const { control, debouncedSearch } = useSearch(SEARCH_DELAY_MS);
	const [scope, setScope] = useState<ValueOf<typeof WorkspaceListScope>>(
		WorkspaceListScope.ALL,
	);
	const { data, isError, isFetching, isLoading } = useGetWorkspacesQuery({
		scope,
		workspaceName: debouncedSearch,
	});
	const workspaces = data?.items ?? [];
	const isListLoading = isLoading || isFetching;
	const isListEmpty = workspaces.length === EMPTY_LENGTH;
	const hasActiveFilter =
		Boolean(debouncedSearch) || scope !== WorkspaceListScope.ALL;
	const hasMatches =
		isListLoading || isError || !isListEmpty || !hasActiveFilter;
	const hasWorkspaces = !isListLoading && !isListEmpty;

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
			const destination = getWorkspaceOpenDestination(workspace.promptCount);
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

	return (
		<div className={getValidClasses("page-container", styles["page-wrapper"])}>
			<WorkspaceHeader onCreate={handleCreateOpen} />

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
				<SegmentedControl
					className={styles["scope"]}
					label="Filter workspaces by ownership"
					onChange={setScope}
					options={WORKSPACE_LIST_SCOPE_OPTIONS}
					value={scope}
				/>
			</div>

			<div className={styles["list"]}>
				{isListLoading && <Loader variant={LoaderVariant.SECTION} />}
				{!hasMatches && (
					<div className={styles["empty-state"]}>
						<p className={styles["empty-state-text"]}>
							{WorkspaceListMessage.NO_MATCHES}
						</p>
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
		</div>
	);
};

export { Workspaces };
