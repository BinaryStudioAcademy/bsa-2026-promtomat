import React from "react";

import { Icon } from "~/libs/components/icon/icon.js";
import { Link } from "~/libs/components/link/link.js";
import { ScoreBadge } from "~/libs/components/score-badge/score-badge.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { IconName } from "~/libs/enums/enums.js";
import { getPromptRoute, getScoreLabel } from "~/modules/prompts/prompts.js";

import { PromptDeliveryViewLabel } from "../../enums/enums.js";
import { type PromptDeliverySource } from "../../types/types.js";
import { PromptDeliveryCard } from "../prompt-delivery-card/prompt-delivery-card.js";
import styles from "./styles.module.css";

type Properties = {
	explanation: string;
	sources: PromptDeliverySource[];
};

const ExplanationSection: React.FC<Properties> = ({
	explanation,
	sources,
}: Properties) => {
	const hasExplanation = explanation.length > EMPTY_LENGTH;
	const hasSources = sources.length > EMPTY_LENGTH;

	if (!hasExplanation && !hasSources) {
		return null;
	}

	return (
		<PromptDeliveryCard>
			<PromptDeliveryCard.Title>
				{PromptDeliveryViewLabel.EXPLANATION_HEADING}
			</PromptDeliveryCard.Title>
			<PromptDeliveryCard.Body>
				{hasExplanation && (
					<p className={styles["explanation"]}>{explanation}</p>
				)}
				{hasSources && (
					<>
						<h3 className={styles["sources-heading"]}>
							{PromptDeliveryViewLabel.SOURCES_HEADING}
						</h3>
						<ol className={styles["sources"]}>
							{sources.map((source) => (
								<li key={source.promptId}>
									<Link
										className={styles["source"]}
										hasDefaultStyles={false}
										shouldOpenInNewTab
										to={getPromptRoute(source.promptId)}
									>
										<span className={styles["source-rank"]}>{source.rank}</span>
										<span className={styles["source-intent"]}>
											{source.taskIntent}
										</span>
										<ScoreBadge
											efficiencyScore={source.efficiencyScore}
											label={getScoreLabel(source.efficiencyScore)}
										/>
										<Icon
											className={styles["source-icon"]}
											iconName={IconName.CHEVRON}
										/>
									</Link>
								</li>
							))}
						</ol>
					</>
				)}
			</PromptDeliveryCard.Body>
		</PromptDeliveryCard>
	);
};

export { ExplanationSection };
