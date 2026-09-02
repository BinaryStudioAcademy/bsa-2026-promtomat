import { useCallback, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useDebounce } from "~/libs/hooks/use-debounce/use-debounce.hook.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces.js";

import { WorkspaceCard } from "./components/workspace-card/workspace-card.js";
import { WorkspaceCreateModal } from "./components/workspace-create-modal/workspace-create-modal.js";
import styles from "./styles.module.css";

const SEARCH_DELAY_MS = 300;

const Workspaces: React.FC = () => {
	const [search, setSearch] = useState<string>("");
	const debouncedSearch = useDebounce(search, SEARCH_DELAY_MS);
	const { data, isError, isLoading } = useGetWorkspacesQuery({
		search: debouncedSearch,
	});
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleModalOpen = useCallback((): void => {
		setIsModalOpen(true);
	}, []);

	const handleModalClose = useCallback((): void => {
		setIsModalOpen(false);
	}, []);

	const handleSearchChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
		},
		[],
	);

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
				<input
					aria-label="Search workspaces"
					className={styles["search-input"]}
					onChange={handleSearchChange}
					placeholder="[ Search workspaces... ]"
					type="search"
					value={search}
				/>
			</div>

			<div className={styles["filters"]}>
				<button className={styles["filter-button-active"]} type="button">
					All
				</button>
				<button className={styles["filter-button"]} type="button">
					Created by you
				</button>
				<button className={styles["filter-button"]} type="button">
					Shared with you
				</button>
			</div>

			<div className={styles["list"]}>
				{isLoading && <Loader variant={LoaderVariant.SECTION} />}
				{isError && <p>Some error</p>}

				{data &&
					data.items.map((workspace) => {
						return <WorkspaceCard key={workspace.id} workspace={workspace} />;
					})}
			</div>

			<WorkspaceCreateModal isOpen={isModalOpen} onClose={handleModalClose} />
		</div>
	);
};

export { Workspaces };
