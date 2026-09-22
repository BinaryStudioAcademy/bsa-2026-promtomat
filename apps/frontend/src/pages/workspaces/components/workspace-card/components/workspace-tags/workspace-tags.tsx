import { EMPTY_LENGTH } from "~/libs/constants/constants.js";

import styles from "./styles.module.css";

type Properties = {
	stackTags: string[];
};

const WorkspaceTags: React.FC<Properties> = ({ stackTags }: Properties) => {
	if (stackTags.length === EMPTY_LENGTH) {
		return null;
	}

	return (
		<ul className={styles["stack-tags"]}>
			{stackTags.map((stackTag) => {
				return (
					<li className={styles["stack-tag"]} key={stackTag}>
						{stackTag}
					</li>
				);
			})}
		</ul>
	);
};

export { WorkspaceTags };
