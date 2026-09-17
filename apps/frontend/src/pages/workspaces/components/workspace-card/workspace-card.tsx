import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize, IconName } from "~/libs/enums/enums.js";
import { capitalizeFirstLetter } from "~/libs/helpers/helpers.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

import { SOLO_MEMBER_COUNT } from "../../libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties = {
	isOwner: boolean;
	onConfig: (workspace: WorkspaceListItemDto) => void;
	onDelete: (workspace: WorkspaceListItemDto) => void;
	onLeave: (workspace: WorkspaceListItemDto) => void;
	onManageAccess: (workspace: WorkspaceListItemDto) => void;
	workspace: WorkspaceListItemDto;
};

const WorkspaceCard: React.FC<Properties> = ({
	isOwner,
	onConfig,
	onDelete,
	onLeave,
	onManageAccess,
	workspace,
}: Properties) => {
	const visibility = capitalizeFirstLetter(workspace.visibility);
	const hasContributors = workspace.memberCount > SOLO_MEMBER_COUNT;
	const hasStackTags = workspace.stackTags.length > EMPTY_LENGTH;

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

	return (
		<div className={styles["card"]}>
			<header className={styles["header"]}>
				<div className={styles["name-group"]}>
					{hasContributors && (
						<Icon
							className={styles["shared-marker"]}
							iconName={IconName.USERS}
						/>
					)}
					<h3 className={styles["title"]}>{workspace.name}</h3>
				</div>
				<span className={styles["visibility-badge"]}>
					<Icon
						className={styles["visibility-icon"]}
						iconName={IconName.LOCK}
					/>
					{visibility}
				</span>
			</header>

			<div className={styles["details"]}>
				{hasStackTags && (
					<ul className={styles["stack-tags"]}>
						{workspace.stackTags.map((stackTag) => {
							return (
								<li className={styles["stack-tag"]} key={stackTag}>
									{stackTag}
								</li>
							);
						})}
					</ul>
				)}
				<div className={styles["detail-row-mono"]}>
					Dataset Readiness: [========== 30%] 300 / 1,000 Prompts
				</div>
				<div className={styles["detail-row-mono"]}>
					Avg Score: 7.2/10 | Members: {workspace.memberCount}
				</div>
			</div>

			<div className={styles["actions"]}>
				{isOwner ? (
					<>
						<Button
							iconName={IconName.USER_COG}
							label="Manage Access"
							onClick={handleManageAccessClick}
							size={ControlSize.MD}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
						<Button
							iconName={IconName.SETTINGS}
							label="Config"
							onClick={handleConfigClick}
							size={ControlSize.MD}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
						<Button
							iconName={IconName.TRASH_2}
							label="Delete"
							onClick={handleDeleteClick}
							size={ControlSize.MD}
							type="button"
							variant={ButtonVariant.DANGER}
						/>
					</>
				) : (
					<Button
						className={styles["leave-button"]}
						iconName={IconName.LOG_OUT}
						label="Leave workspace"
						onClick={handleLeaveClick}
						size={ControlSize.MD}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
				)}
			</div>
		</div>
	);
};
export { WorkspaceCard };
