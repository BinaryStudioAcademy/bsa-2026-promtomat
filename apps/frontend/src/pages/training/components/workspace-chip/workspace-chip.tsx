import React from "react";

import { getWorkspaceInitials } from "./libs/helpers/helpers.js";
import styles from "./styles.module.css";

type Properties = {
	name: string;
};

const WorkspaceChip: React.FC<Properties> = ({ name }: Properties) => {
	return <span className={styles["chip"]}>{getWorkspaceInitials(name)}</span>;
};

export { WorkspaceChip };
