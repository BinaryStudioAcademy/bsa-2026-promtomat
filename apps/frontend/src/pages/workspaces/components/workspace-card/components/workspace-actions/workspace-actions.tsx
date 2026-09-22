import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	isOwner: boolean;
	onConfig: (workspace: WorkspaceListItemDto) => void;
	onDelete: (workspace: WorkspaceListItemDto) => void;
	onLeave: (workspace: WorkspaceListItemDto) => void;
	onManageAccess: (workspace: WorkspaceListItemDto) => void;
	onOpen: (workspace: WorkspaceListItemDto) => void;
	workspace: WorkspaceListItemDto;
};

const WorkspaceActions: React.FC<Properties> = ({
	isOwner,
	onConfig,
	onDelete,
	onLeave,
	onManageAccess,
	onOpen,
	workspace,
}: Properties) => {
	const handleConfigClick = useCallback((): void => {
		onConfig(workspace);
	}, [onConfig, workspace]);

	const handleDeleteClick = useCallback((): void => {
		onDelete(workspace);
	}, [onDelete, workspace]);

	const handleLeaveClick = useCallback((): void => {
		onLeave(workspace);
	}, [onLeave, workspace]);

	const handleManageAccessClick = useCallback((): void => {
		onManageAccess(workspace);
	}, [onManageAccess, workspace]);

	const handleOpenClick = useCallback((): void => {
		onOpen(workspace);
	}, [onOpen, workspace]);

	return (
		<div className={styles["actions"]}>
			<Button
				className={getValidClasses(styles["primary-action"])}
				label="Open"
				onClick={handleOpenClick}
				size={ControlSize.MD}
				type="button"
				variant={ButtonVariant.SECONDARY}
			/>
			{isOwner ? (
				<>
					<Button
						label="Config"
						onClick={handleConfigClick}
						size={ControlSize.MD}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
					<Button
						label="Delete"
						onClick={handleDeleteClick}
						size={ControlSize.MD}
						type="button"
						variant={ButtonVariant.DANGER}
					/>
				</>
			) : (
				<>
					<Button
						label="Members"
						onClick={handleManageAccessClick}
						size={ControlSize.MD}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
					<Button
						label="Leave"
						onClick={handleLeaveClick}
						size={ControlSize.MD}
						type="button"
						variant={ButtonVariant.DANGER}
					/>
				</>
			)}
		</div>
	);
};

export { WorkspaceActions };
