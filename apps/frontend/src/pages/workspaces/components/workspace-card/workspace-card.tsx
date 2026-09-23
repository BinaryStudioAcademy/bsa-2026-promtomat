import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { ButtonVariant, ControlSize, IconName } from "~/libs/enums/enums.js";
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
					<h3 className={styles["title"]}>{workspace.name}</h3>
					<span className={styles["visibility-badge"]}>
						<Icon
							className={styles["visibility-icon"]}
							iconName={IconName.LOCK}
						/>
						{visibility}
					</span>
				</header>

				<WorkspaceTags stackTags={workspace.stackTags} />

				<div className={styles["readiness"]}>
					<ProgressBar
						count={workspace.promptCount}
						label="Dataset readiness"
						target={PromptProgress.TARGET_COUNT}
					/>
				</div>

				<WorkspaceMetrics memberCount={workspace.memberCount} />
				<Button
					className={styles["config"]}
					iconName={IconName.SETTINGS}
					label="Config"
					onClick={handleConfigClick}
					size={ControlSize.MD}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			</div>
		</div>
	);
};

export { WorkspaceCard };
