import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

import { WORKSPACE_CARD_EMPTY_METRIC } from "../../libs/constants/constants.js";
import { WorkspaceMetric } from "./libs/components/workspace-metric/workspace-metric.js";
import styles from "./styles.module.css";

type Properties = {
	workspace: WorkspaceListItemDto;
};

const WorkspaceMetrics: React.FC<Properties> = ({ workspace }: Properties) => {
	const activityTone =
		workspace.recentActivity > ZERO_VALUE ? "active" : undefined;

	return (
		<div className={styles["metrics"]}>
			<WorkspaceMetric
				label="Avg score"
				value={workspace.averageScore ?? WORKSPACE_CARD_EMPTY_METRIC}
			/>
			<WorkspaceMetric
				label="7-day"
				tone={activityTone}
				value={`+${String(workspace.recentActivity)}`}
			/>
			<WorkspaceMetric label="Members" value={workspace.memberCount} />
		</div>
	);
};

export { WorkspaceMetrics };
