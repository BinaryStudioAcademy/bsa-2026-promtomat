import { Button } from "~/libs/components/button/button.js";
import { PageIntro } from "~/libs/components/page-intro/page-intro.js";
import { IconName } from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

type Properties = {
	onCreate: () => void;
};

const WorkspaceHeader: React.FC<Properties> = ({ onCreate }: Properties) => {
	return (
		<div className={styles["header"]}>
			<PageIntro
				className={styles["intro"]}
				description="Each workspace collects the prompts behind one codebase. Log enough of them and the retrieval index starts answering for you."
				label="Workspaces"
				title="Codebase overview"
			/>
			<Button
				className={styles["create-button"]}
				iconName={IconName.PLUS}
				label="Create workspace"
				onClick={onCreate}
				type="button"
			/>
		</div>
	);
};

export { WorkspaceHeader };
