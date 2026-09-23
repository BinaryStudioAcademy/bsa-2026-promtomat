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
import { IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useSearch } from "~/libs/hooks/use-search/use-search.hook.js";
import { type ValueOf } from "~/libs/types/types.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useGetWorkspacesQuery,
	WorkspaceListScope,
} from "~/modules/workspaces/workspaces.js";

import { WorkspaceCard } from "./components/workspace-card/workspace-card.js";
import { WorkspaceConfigModal } from "./components/workspace-config-modal/workspace-config-modal.js";
import { WorkspaceContributorsModal } from "./components/workspace-contributors-modal/workspace-contributors-modal.js";
import { WorkspaceCreateModal } from "./components/workspace-create-modal/workspace-create-modal.js";
import { WorkspaceDeleteModal } from "./components/workspace-delete-modal/workspace-delete-modal.js";
import { WorkspaceHeader } from "./components/workspace-header/workspace-header.js";
import { WorkspaceLeaveModal } from "./components/workspace-leave-modal/workspace-leave-modal.js";
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
	const { data: user } = useGetAuthenticatedUserQuery(undefined);
	const currentUserId = user?.id;
	const { data, isError, isFetching, isLoading } = useGetWorkspacesQuery({
		scope,
		workspaceName: debouncedSearch,
	});
	const workspaces = data?.items ?? [];
	const isListLoading = isLoading || isFetching;
	const isListEmpty = workspaces.length === EMPTY_LENGTH;
	const hasActiveFilter =
		Boolean(debouncedSearch) || scope !== WorkspaceListScope.ALL;
	const hasNoMatches =
		!isListLoading && !isError && isListEmpty && hasActiveFilter;
	const hasWorkspaces = !isListLoading && !isListEmpty;

	const [activeModal, setActiveModal] = useState<ActiveModal>(null);

	const handleCreateOpen = useCallback((): void => {
		setActiveModal({ type: "create" });
	}, []);

	const handleConfigOpen = useCallback(
		(workspace: WorkspaceListItemDto): void => {
			setActiveModal({ type: "config", workspace });
		},
		[],
	);

	const handleDeleteOpen = useCallback(
		(workspace: WorkspaceListItemDto): void => {
			setActiveModal({ type: "delete", workspace });
		},
		[],
	);

	const handleLeaveOpen = useCallback(
		(workspace: WorkspaceListItemDto): void => {
			setActiveModal({ type: "leave", workspace });
		},
		[],
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

	const handleManageAccessOpen = useCallback(
		(workspace: WorkspaceListItemDto): void => {
			setActiveModal({ type: "manage-access", workspace });
		},
		[],
	);

	const handleModalClose = useCallback((): void => {
		setActiveModal(null);
	}, []);

	const isActiveWorkspaceOwner =
		activeModal?.type === "manage-access" &&
		activeModal.workspace.userId === currentUserId;

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
				{hasNoMatches && (
					<div className={styles["empty-state"]}>
						<p className={styles["empty-state-text"]}>
							{WorkspaceListMessage.NO_MATCHES}
						</p>
					</div>
				)}
				{hasWorkspaces &&
					workspaces.map((workspace) => {
						const isOwner = workspace.userId === currentUserId;
						return (
							<WorkspaceCard
								isOwner={isOwner}
								key={workspace.id}
								onConfig={handleConfigOpen}
								onDelete={handleDeleteOpen}
								onLeave={handleLeaveOpen}
								onManageAccess={handleManageAccessOpen}
								onOpen={handleOpen}
								workspace={workspace}
							/>
						);
					})}
			</div>

			{activeModal?.type === "create" && (
				<WorkspaceCreateModal onClose={handleModalClose} />
			)}

			{activeModal?.type === "config" && (
				<WorkspaceConfigModal
					onClose={handleModalClose}
					workspace={activeModal.workspace}
				/>
			)}

			{activeModal?.type === "delete" && (
				<WorkspaceDeleteModal
					onClose={handleModalClose}
					workspace={activeModal.workspace}
				/>
			)}

			{activeModal?.type === "leave" && user && (
				<WorkspaceLeaveModal
					currentUserId={user.id}
					onClose={handleModalClose}
					workspace={activeModal.workspace}
				/>
			)}

			{activeModal?.type === "manage-access" && (
				<WorkspaceContributorsModal
					isOwner={isActiveWorkspaceOwner}
					onClose={handleModalClose}
					workspace={activeModal.workspace}
				/>
			)}
		</div>
	);
};

export { Workspaces };
