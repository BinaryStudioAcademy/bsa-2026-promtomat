import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import { AppRoute, ButtonVariant, IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

import { WorkspaceDeleteMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";
import { WorkspaceDeleteModal } from "../workspace-delete-modal/workspace-delete-modal.js";

type Properties = {
	workspace: WorkspaceListItemDto;
};

const DangerZone: React.FC<Properties> = ({ workspace }: Properties) => {
	const navigate = useNavigate();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const handleDeleteOpen = useCallback((): void => {
		setIsDeleteModalOpen(true);
	}, []);

	const handleDeleteClose = useCallback((): void => {
		setIsDeleteModalOpen(false);
	}, []);

	const handleDeleted = useCallback((): void => {
		void navigate(AppRoute.WORKSPACES);
	}, [navigate]);

	return (
		<section className={getValidClasses(styles["card"], styles["danger"])}>
			<h3
				className={getValidClasses(
					styles["section-title"],
					styles["danger-title"],
				)}
			>
				Danger zone
			</h3>
			<p className={styles["danger-text"]}>
				{WorkspaceDeleteMessage.DANGER_ZONE_DESCRIPTION}
			</p>
			<Button
				className={styles["danger-button"]}
				iconName={IconName.TRASH_2}
				label={WorkspaceDeleteMessage.DELETE}
				onClick={handleDeleteOpen}
				type="button"
				variant={ButtonVariant.DANGER}
			/>
			{isDeleteModalOpen && (
				<WorkspaceDeleteModal
					onClose={handleDeleteClose}
					onDeleted={handleDeleted}
					workspace={workspace}
				/>
			)}
		</section>
	);
};

export { DangerZone };
