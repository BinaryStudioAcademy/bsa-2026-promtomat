import { skipToken } from "@reduxjs/toolkit/query";
import React from "react";
import { Link } from "react-router-dom";

import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
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
	const { currentData: recent, isError } = useGetPromptRecentQuery(
		workspaceId === undefined ? skipToken : { workspaceId },
	);

	let content: React.ReactNode;

	if (workspaceId === undefined) {
		content = (
			<p className={styles["message"]}>{RecentPromptsMessage.NO_WORKSPACE}</p>
		);
	} else if (isError) {
		content = <p className={styles["message"]}>{RecentPromptsMessage.ERROR}</p>;
	} else if (!recent) {
		content = (
			<Loader
				label={RecentPromptsMessage.LOADING}
				variant={LoaderVariant.SECTION}
			/>
		);
	} else if (recent.items.length === EMPTY_LENGTH) {
		content = <p className={styles["message"]}>{RecentPromptsMessage.EMPTY}</p>;
	} else {
		content = (
			<ul className={styles["list"]}>
				{recent.items.map((item) => {
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
		);
	}

	return (
		<section className={styles["card"]}>
			<h2 className={styles["title"]}>{RecentPromptsMessage.TITLE}</h2>
			{content}
		</section>
	);
};

export { RecentPrompts };
