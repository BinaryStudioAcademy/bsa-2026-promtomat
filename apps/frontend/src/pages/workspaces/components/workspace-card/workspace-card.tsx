import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize, IconName } from "~/libs/enums/enums.js";
import {
	capitalizeFirstLetter,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { PromptProgress } from "~/modules/prompts/prompts.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

import { Metric } from "./components/metric/metric.js";
import { WORKSPACE_CARD_EMPTY_METRIC } from "./libs/constants/constants.js";
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

const WorkspaceCard: React.FC<Properties> = ({
	isOwner,
	onConfig,
	onDelete,
	onLeave,
	onManageAccess,
	onOpen,
	workspace,
}: Properties) => {
	const visibility = capitalizeFirstLetter(workspace.visibility);
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

	const handleOpenClick = useCallback((): void => {
		onOpen(workspace);
	}, [onOpen, workspace]);

	return (
		<div className={styles["card"]}>
			<header className={styles["header"]}>
				<h3 className={styles["title"]}>{workspace.name}</h3>
				<span className={styles["visibility-badge"]}>
					<Icon
						className={styles["visibility-icon"]}
						iconName={IconName.LOCK}
					/>
					{visibility}
				</span>
			</header>

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

			<div className={styles["readiness"]}>
				<ProgressBar
					count={workspace.promptCount}
					label="Dataset readiness"
					target={PromptProgress.TARGET_COUNT}
				/>
			</div>

			<div className={styles["metrics"]}>
				<Metric label="Avg score" value={WORKSPACE_CARD_EMPTY_METRIC} />
				<Metric label="7-day" value={WORKSPACE_CARD_EMPTY_METRIC} />
				<Metric label="Members" value={workspace.memberCount} />
			</div>

			<div className={styles["actions"]}>
				{isOwner ? (
					<>
						<Button
							className={styles["primary-action"]}
							label="Open"
							onClick={handleOpenClick}
							size={ControlSize.MD}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
						<Button
							label="Config"
							onClick={handleConfigClick}
							size={ControlSize.MD}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
						<Button
							className={styles["danger-action"]}
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
							className={styles["primary-action"]}
							label="Open"
							onClick={handleOpenClick}
							size={ControlSize.MD}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
						<Button
							label="Members"
							onClick={handleManageAccessClick}
							size={ControlSize.MD}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
						<Button
							className={getValidClasses(
								styles["leave-button"],
								styles["danger-action"],
							)}
							label="Leave workspace"
							onClick={handleLeaveClick}
							size={ControlSize.MD}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
					</>
				)}
			</div>
		</div>
	);
};
export { WorkspaceCard };
