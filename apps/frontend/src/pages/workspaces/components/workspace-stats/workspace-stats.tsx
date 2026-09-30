import { getValidClasses } from "~/libs/helpers/helpers.js";

import { WORKSPACE_EMPTY_METRIC } from "../../libs/constants/constants.js";
import { SCORE_FRACTION_DIGITS } from "./libs/constants/constants.js";
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
	const averageScoreLabel =
		averageScore === null
			? WORKSPACE_EMPTY_METRIC
			: averageScore.toFixed(SCORE_FRACTION_DIGITS);

	const stats = [
		{
			caption: "active",
			isWide: false,
			label: "Workspaces",
			tone: "strong",
			value: String(workspaceCount),
		},
		{
			caption: "total",
			isWide: false,
			label: "Prompts logged",
			tone: "accent",
			value: promptCount.toLocaleString("en-US"),
		},
		{
			caption: "/ 10",
			isWide: true,
			label: "Avg score",
			tone: "success",
			value: averageScoreLabel,
		},
	] as const;

	return (
		<section aria-label="Workspace collection">
			<dl className={styles["stats"]}>
				{stats.map((stat) => (
					<div
						className={getValidClasses(
							styles["stat"],
							stat.isWide && styles["wide"],
						)}
						key={stat.label}
					>
						<dt className={styles["label"]}>{stat.label}</dt>
						<dd className={styles["figure"]}>
							<span
								className={getValidClasses(styles["value"], styles[stat.tone])}
							>
								{stat.value}
							</span>
							<span className={styles["caption"]}>{stat.caption}</span>
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
};

export { WorkspaceStats };
