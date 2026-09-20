import { skipToken } from "@reduxjs/toolkit/query";
import React from "react";
import { Link } from "react-router-dom";

import { getScoreColor } from "~/libs/components/score-grid/libs/helpers/get-score-color.helper.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { configureString, getValidClasses } from "~/libs/helpers/helpers.js";
import { useGetPromptRecentQuery } from "~/modules/prompts/prompts-api.js";
import { PromptValidationRule } from "~/modules/prompts/prompts.js";

import { RecentPromptsMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	workspaceId: number | undefined;
};

const RecentPrompts: React.FC<Properties> = ({ workspaceId }: Properties) => {
	const { data } = useGetPromptRecentQuery(
		workspaceId === undefined ? skipToken : { workspaceId },
	);

	const items = data?.items ?? [];
	const hasItems = items.length > EMPTY_LENGTH;
	const emptyMessage =
		workspaceId === undefined
			? RecentPromptsMessage.NO_WORKSPACE
			: RecentPromptsMessage.EMPTY;

	return (
		<section className={styles["card"]}>
			<h2 className={styles["title"]}>{RecentPromptsMessage.TITLE}</h2>
			{hasItems ? (
				<ul className={styles["list"]}>
					{items.map((item) => {
						const promptPath = configureString(AppRoute.PROMPTS_$PROMPT_ID, {
							promptId: String(item.id),
						});

						return (
							<li key={item.id}>
								<Link className={styles["item"]} to={promptPath}>
									<span className={styles["intent"]}>{item.taskIntent}</span>
									<span
										className={getValidClasses(
											styles["score"],
											styles[getScoreColor(item.efficiencyScore)],
										)}
									>
										{item.efficiencyScore}/
										{PromptValidationRule.EFFICIENCY_SCORE_MAX}
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			) : (
				<p className={styles["empty"]}>{emptyMessage}</p>
			)}
		</section>
	);
};

export { RecentPrompts };
