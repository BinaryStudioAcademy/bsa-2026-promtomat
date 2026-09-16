import { type WorkspaceUserSummaryDto } from "~/modules/workspaces/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	action?: React.ReactNode;
	user: WorkspaceUserSummaryDto;
};

const UserItem: React.FC<Properties> = ({ action, user }: Properties) => {
	return (
		<li className={styles["item"]}>
			<div className={styles["identity"]}>
				<span className={styles["name"]}>{user.nickname}</span>
				<span className={styles["email"]}>{user.email}</span>
			</div>
			{action}
		</li>
	);
};

export { UserItem };
