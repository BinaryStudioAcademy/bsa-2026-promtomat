import { ScoreValue } from "~/libs/components/score-value/score-value.js";
import { StatCard } from "~/libs/components/stat-card/stat-card.js";
import { StatGrid } from "~/libs/components/stat-grid/stat-grid.js";
import { SCORE_SCALE_CAPTION } from "~/libs/constants/constants.js";
import { Locale } from "~/libs/enums/enums.js";

import { WorkspaceStatsLabel } from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	averageScore: null | number;
	promptCount: number;
	workspaceCount: number;
};

const WorkspaceStats: React.FC<Properties> = ({
	averageScore,
	promptCount,
	workspaceCount,
}: Properties) => {
	return (
		<div className={styles["stats"]}>
			<StatGrid label={WorkspaceStatsLabel.SECTION}>
				<StatCard
					caption={WorkspaceStatsLabel.WORKSPACES_CAPTION}
					label={WorkspaceStatsLabel.WORKSPACES}
				>
					{workspaceCount}
				</StatCard>
				<StatCard
					caption={WorkspaceStatsLabel.PROMPTS_CAPTION}
					label={WorkspaceStatsLabel.PROMPTS}
				>
					<span className={styles["accent"]}>
						{promptCount.toLocaleString(Locale.EN_US)}
					</span>
				</StatCard>
				<StatCard
					caption={averageScore === null ? undefined : SCORE_SCALE_CAPTION}
					label={WorkspaceStatsLabel.AVERAGE_SCORE}
				>
					<ScoreValue score={averageScore} />
				</StatCard>
			</StatGrid>
		</div>
	);
};

export { WorkspaceStats };
