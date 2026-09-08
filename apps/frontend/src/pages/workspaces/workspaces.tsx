import { useCallback, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useSearch } from "~/libs/hooks/use-search/use-search.hook.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces.js";

import { WorkspaceCard } from "./components/workspace-card/workspace-card.js";
import { WorkspaceCreateModal } from "./components/workspace-create-modal/workspace-create-modal.js";
import styles from "./styles.module.css";

const SEARCH_DELAY_MS = 300;

const Workspaces: React.FC = () => {
	const { control, debouncedSearch } = useSearch(SEARCH_DELAY_MS);
	const { data, isLoading } = useGetWorkspacesQuery({
		workspaceName: debouncedSearch,
	});
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleModalOpen = useCallback((): void => {
		setIsModalOpen(true);
	}, []);

	const handleModalClose = useCallback((): void => {
		setIsModalOpen(false);
	}, []);

	return (
		<div className={getValidClasses("page-container", styles["page-wrapper"])}>
			<header className={styles["header"]}>
				<h2 className={styles["title"]}>WORKSPACES / PROJECT MANAGER</h2>
				<Button
					label="Create Workspace"
					onClick={handleModalOpen}
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
					return <WorkspaceCard key={workspace.id} workspace={workspace} />;
				})}
			</div>

			<WorkspaceCreateModal isOpen={isModalOpen} onClose={handleModalClose} />
		</div>
	);
};

export { Workspaces };
