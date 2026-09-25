import { EMPTY_LENGTH, ZERO_VALUE } from "~/libs/constants/constants.js";

import { WORKSPACE_CARD_VISIBLE_TAGS_COUNT } from "../../libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties = {
	stackTags: string[];
};

const WorkspaceTags: React.FC<Properties> = ({ stackTags }: Properties) => {
	if (stackTags.length === EMPTY_LENGTH) {
		return null;
	}

	const visibleTags = stackTags.slice(
		ZERO_VALUE,
		WORKSPACE_CARD_VISIBLE_TAGS_COUNT,
	);
	const hiddenTagsCount = stackTags.length - visibleTags.length;
	const hasHiddenTags = hiddenTagsCount > EMPTY_LENGTH;
	const hiddenTagsLabel = `+${String(hiddenTagsCount)}`;

	return (
		<ul className={styles["stack-tags"]}>
			{visibleTags.map((stackTag) => {
				return (
					<li className={styles["stack-tag"]} key={stackTag}>
						{stackTag}
					</li>
				);
			})}
			{hasHiddenTags && (
				<li className={styles["stack-tag"]}>{hiddenTagsLabel}</li>
			)}
		</ul>
	);
};

export { WorkspaceTags };
