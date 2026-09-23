import { useCallback } from "react";

import { IconButton } from "~/libs/components/icon-button/icon-button.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { ControlSize, IconName } from "~/libs/enums/enums.js";
import { capitalizeFirstLetter } from "~/libs/helpers/helpers.js";
import { PromptProgress } from "~/modules/prompts/prompts.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

import { WorkspaceMetrics } from "./components/workspace-metrics/workspace-metrics.js";
import { WorkspaceTags } from "./components/workspace-tags/workspace-tags.js";
import styles from "./styles.module.css";

type Properties = {
	onConfig: (workspace: WorkspaceListItemDto) => void;
	onOpen: (workspace: WorkspaceListItemDto) => void;
	workspace: WorkspaceListItemDto;
};

const WorkspaceCard: React.FC<Properties> = ({
	onConfig,
	onOpen,
	workspace,
}: Properties) => {
	const hasDescription = Boolean(workspace.description);
	const visibility = capitalizeFirstLetter(workspace.visibility);

	const handleConfigClick = useCallback((): void => {
		onConfig(workspace);
	}, [onConfig, workspace]);

	const handleOpenClick = useCallback((): void => {
		onOpen(workspace);
	}, [onOpen, workspace]);

	return (
		<div className={styles["card"]}>
			<button
				aria-label={`Open ${workspace.name}`}
				className={styles["open-target"]}
				onClick={handleOpenClick}
				type="button"
			/>
			<div className={styles["body"]}>
				<header className={styles["header"]}>
					<div className={styles["identity"]}>
						<h3 className={styles["title"]}>{workspace.name}</h3>
						<span className={styles["visibility-badge"]}>
							<Icon
								className={styles["visibility-icon"]}
								iconName={IconName.LOCK}
							/>
							{visibility}
						</span>
						{hasDescription && (
							<p className={styles["description"]}>{workspace.description}</p>
						)}
					</div>
					<IconButton
						ariaLabel={`Config ${workspace.name}`}
						className={styles["config"]}
						iconName={IconName.SETTINGS}
						onClick={handleConfigClick}
						size={ControlSize.SM}
					/>
				</header>
				<div className={styles["details"]}>
					<WorkspaceTags stackTags={workspace.stackTags} />

					<div className={styles["readiness"]}>
						<ProgressBar
							count={workspace.promptCount}
							label="Dataset readiness"
							target={PromptProgress.TARGET_COUNT}
						/>
					</div>

					<WorkspaceMetrics memberCount={workspace.memberCount} />
				</div>
			</div>
		</div>
	);
};

export { WorkspaceCard };
