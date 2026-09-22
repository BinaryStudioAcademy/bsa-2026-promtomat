import React from "react";
import { Link } from "react-router-dom";

import { getScoreColor } from "~/libs/components/score-grid/libs/helpers/get-score-color.helper.js";
import { AppRoute } from "~/libs/enums/enums.js";
import {
	configureString,
	getRelativeTimeLabel,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	prompt: PromptItemResponseDto;
};

const PromptListItem: React.FC<Properties> = ({ prompt }: Properties) => {
	const scoreColorClass = styles[getScoreColor(prompt.score)];
	const relativeTime = getRelativeTimeLabel(prompt.createdAt);
	const deliveryPath = configureString(AppRoute.PROMPTS_$PROMPT_ID, {
		promptId: String(prompt.id),
	});

	return (
		<Link className={styles["item"]} to={deliveryPath}>
			<div className={styles["row"]}>
				<div
					className={getValidClasses(styles["score-badge"], scoreColorClass)}
				>
					{prompt.score}
				</div>
				<div className={styles["info"]}>
					<span className={styles["intent"]}>{prompt.intent}</span>
					<span className={styles["meta"]}>{prompt.workspaceName}</span>
				</div>
				<div className={styles["right-controls"]}>
					<span className={styles["timestamp"]}>Injected {relativeTime}</span>
				</div>
			</div>
		</Link>
	);
};

export { PromptListItem };
