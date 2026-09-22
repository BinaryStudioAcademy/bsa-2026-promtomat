import { WORKSPACE_CARD_EMPTY_METRIC } from "../../libs/constants/constants.js";
import { WorkspaceMetric } from "./libs/components/workspace-metric/workspace-metric.js";
import styles from "./styles.module.css";

type Properties = {
	memberCount: number;
};

const WorkspaceMetrics: React.FC<Properties> = ({
	memberCount,
}: Properties) => {
	return (
		<div className={styles["metrics"]}>
			<WorkspaceMetric label="Avg score" value={WORKSPACE_CARD_EMPTY_METRIC} />
			<WorkspaceMetric label="7-day" value={WORKSPACE_CARD_EMPTY_METRIC} />
			<WorkspaceMetric label="Members" value={memberCount} />
		</div>
	);
};

export { WorkspaceMetrics };
