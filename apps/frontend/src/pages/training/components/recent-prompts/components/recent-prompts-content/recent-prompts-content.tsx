import React from "react";

import { Link } from "~/libs/components/link/link.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PromptDetailLabel } from "~/libs/components/prompt-detail-panel/libs/enums/enums.js";
import { getScoreColor } from "~/libs/components/score-grid/libs/helpers/get-score-color.helper.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";
import {
	getPromptRoute,
	type PromptRecentDto,
	PromptValidationRule,
} from "~/modules/prompts/prompts.js";

import {
	RecentPromptsMessage,
	RecentPromptsState,
} from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	items: PromptRecentDto[];
	state: ValueOf<typeof RecentPromptsState>;
};

const RecentPromptsContent: React.FC<Properties> = ({
	items,
	state,
}: Properties) => {
	if (state === RecentPromptsState.NO_WORKSPACE) {
		return (
			<p className={styles["message"]}>{RecentPromptsMessage.NO_WORKSPACE}</p>
		);
	}

	if (state === RecentPromptsState.ERROR) {
		return <p className={styles["message"]}>{RecentPromptsMessage.ERROR}</p>;
	}

	if (state === RecentPromptsState.LOADING) {
		return (
			<Loader
				label={RecentPromptsMessage.LOADING}
				variant={LoaderVariant.SECTION}
			/>
		);
	}

	if (state === RecentPromptsState.EMPTY) {
		return <p className={styles["message"]}>{RecentPromptsMessage.EMPTY}</p>;
	}

	return (
		<ul className={styles["list"]}>
			{items.map((item) => {
				return (
					<li key={item.id}>
						<Link
							className={styles["item"]}
							hasDefaultStyles={false}
							to={getPromptRoute(item.id)}
						>
							<span className={styles["intent"]}>{item.taskIntent}</span>
							{item.efficiencyScore === null ? (
								<span className={styles["score"]}>
									{PromptDetailLabel.UNRATED}
								</span>
							) : (
								<span
									className={getValidClasses(
										styles["score"],
										styles[getScoreColor(item.efficiencyScore)],
									)}
								>
									{item.efficiencyScore}/
									{PromptValidationRule.EFFICIENCY_SCORE_MAX}
								</span>
							)}
						</Link>
					</li>
				);
			})}
		</ul>
	);
};

export { RecentPromptsContent };
