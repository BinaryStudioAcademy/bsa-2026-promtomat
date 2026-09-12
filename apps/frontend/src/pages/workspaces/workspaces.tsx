import { useCallback, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useSearch } from "~/libs/hooks/use-search/use-search.hook.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces.js";

import { WorkspaceCard } from "./components/workspace-card/workspace-card.js";
import { WorkspaceConfigModal } from "./components/workspace-config-modal/workspace-config-modal.js";
import { WorkspaceCreateModal } from "./components/workspace-create-modal/workspace-create-modal.js";
import { WorkspaceDeleteModal } from "./components/workspace-delete-modal/workspace-delete-modal.js";
import { type ActiveModal } from "./libs/types/types.js";
import styles from "./styles.module.css";

const SEARCH_DELAY_MS = 300;

const Workspaces: React.FC = () => {
	const { control, debouncedSearch } = useSearch(SEARCH_DELAY_MS);
	const { data, isLoading } = useGetWorkspacesQuery({
		workspaceName: debouncedSearch,
	});

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

	const handleModalClose = useCallback((): void => {
		setActiveModal(null);
	}, []);

	return (
		<div className={getValidClasses("page-container", styles["page-wrapper"])}>
			<header className={styles["header"]}>
				<h2 className={styles["title"]}>WORKSPACES / PROJECT MANAGER</h2>
				<Button
					label="Create Workspace"
					onClick={handleCreateOpen}
					type="button"
				/>
			</header>

			<div className={styles["search-container"]}>
				<Input
					control={control}
					label="Search"
					name="search"
					placeholder="Search workspace..."
				/>
			</div>

			<div className={styles["list"]}>
				{isLoading && <Loader variant={LoaderVariant.SECTION} />}

				{data?.items.map((workspace) => {
					return (
						<WorkspaceCard
							key={workspace.id}
							onConfig={handleConfigOpen}
							onDelete={handleDeleteOpen}
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
		</div>
	);
};

export { Workspaces };
