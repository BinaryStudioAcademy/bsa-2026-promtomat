import { Icon } from "~/libs/components/icon/icon.js";
import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { IconName } from "~/libs/enums/enums.js";
import { capitalizeFirstLetter } from "~/libs/helpers/helpers.js";
import { PromptProgress } from "~/modules/prompts/prompts.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

import { WorkspaceActions } from "./components/workspace-actions/workspace-actions.js";
import { WorkspaceMetrics } from "./components/workspace-metrics/workspace-metrics.js";
import { WorkspaceTags } from "./components/workspace-tags/workspace-tags.js";
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

			<WorkspaceTags stackTags={workspace.stackTags} />

			<div className={styles["readiness"]}>
				<ProgressBar
					count={workspace.promptCount}
					label="Dataset readiness"
					target={PromptProgress.TARGET_COUNT}
				/>
			</div>

			<WorkspaceMetrics memberCount={workspace.memberCount} />
			<WorkspaceActions
				isOwner={isOwner}
				onConfig={onConfig}
				onDelete={onDelete}
				onLeave={onLeave}
				onManageAccess={onManageAccess}
				onOpen={onOpen}
				workspace={workspace}
			/>
		</div>
	);
};
export { WorkspaceCard };
