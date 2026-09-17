import { useCallback, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
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
import { WorkspaceLeaveModal } from "./components/workspace-leave-modal/workspace-leave-modal.js";
import { WorkspaceListScopeFilter } from "./components/workspace-list-scope-filter/workspace-list-scope-filter.js";
import { type ActiveModal } from "./libs/types/types.js";
import styles from "./styles.module.css";

const SEARCH_DELAY_MS = 300;

const Workspaces: React.FC = () => {
	const { control, debouncedSearch } = useSearch(SEARCH_DELAY_MS);
	const [scope, setScope] = useState<ValueOf<typeof WorkspaceListScope>>(
		WorkspaceListScope.ALL,
	);
	const { data: user } = useGetAuthenticatedUserQuery(undefined);
	const currentUserId = user?.id;
	const { data, isLoading } = useGetWorkspacesQuery({
		scope,
		workspaceName: debouncedSearch,
	});
	const workspaces = data?.items ?? [];

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

	const handleManageAccessOpen = useCallback(
		(workspace: WorkspaceListItemDto): void => {
			setActiveModal({ type: "manage-access", workspace });
		},
		[],
	);

	const handleModalClose = useCallback((): void => {
		setActiveModal(null);
	}, []);

	return (
		<div className={getValidClasses("page-container", styles["page-wrapper"])}>
			<header className={styles["header"]}>
				<h2 className={styles["title"]}>WORKSPACES / PROJECT MANAGER</h2>
				<Button
					iconName={IconName.PLUS}
					label="Create Workspace"
					onClick={handleCreateOpen}
					type="button"
				/>
			</header>

			<div className={styles["filter-container"]}>
				<WorkspaceListScopeFilter
					activeScope={scope}
					onScopeChange={setScope}
				/>
			</div>

			<div className={styles["search-container"]}>
				<Input
					control={control}
					label="Search"
					name="search"
					placeholder="Search workspace"
				/>
			</div>

			<div className={styles["list"]}>
				{isLoading && <Loader variant={LoaderVariant.SECTION} />}
				{workspaces.map((workspace) => {
					const isOwner = workspace.userId === currentUserId;
					return (
						<WorkspaceCard
							isOwner={isOwner}
							key={workspace.id}
							onConfig={handleConfigOpen}
							onDelete={handleDeleteOpen}
							onLeave={handleLeaveOpen}
							onManageAccess={handleManageAccessOpen}
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
					onClose={handleModalClose}
					workspace={activeModal.workspace}
				/>
			)}
		</div>
	);
};

export { Workspaces };
