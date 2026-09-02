import { Button } from "~/libs/components/button/button.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { type WorkspaceDto } from "~/modules/workspaces/libs/types/types.js";

import styles from "./styles.module.css";

const FIRST_LETTER_INDEX = 0;
const REMAINING_LETTERS_START = 1;

type Properties = {
	workspace: WorkspaceDto;
};

const WorkspaceCard: React.FC<Properties> = ({ workspace }: Properties) => {
	const visibility =
		workspace.visibility.charAt(FIRST_LETTER_INDEX).toUpperCase() +
		workspace.visibility.slice(REMAINING_LETTERS_START);

	return (
		<div className={styles["card"]}>
			<header className={styles["header"]}>
				<h3 className={styles["title"]}>{workspace.name}</h3>
				<span className={styles["visibility-badge"]}>{visibility}</span>
			</header>

			<div className={styles["details"]}>
				<div className={styles["detail-row"]}>
					Tech Stack:{" "}
					<span className={styles["detail-value"]}>
						{workspace.stackTags.join(", ")}
					</span>
				</div>
				<div className={styles["detail-row-mono"]}>
					Dataset Readiness: [========== 30%] 300 / 1,000 Prompts
				</div>
				<div className={styles["detail-row-mono"]}>
					Metrics: Avg Score: 7.2/10 | Contributors: 1
				</div>
			</div>

			<div className={styles["actions"]}>
				<Button
					label="Share"
					size={ControlSize.SM}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
				<Button
					label="Config"
					size={ControlSize.SM}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
				<Button
					label="Delete"
					size={ControlSize.SM}
					type="button"
					variant={ButtonVariant.DANGER}
				/>
			</div>
		</div>
	);
};
export { WorkspaceCard };
