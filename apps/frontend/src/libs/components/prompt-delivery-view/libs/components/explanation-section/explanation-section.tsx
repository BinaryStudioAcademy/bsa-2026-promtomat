import React from "react";

import { EMPTY_LENGTH } from "~/libs/constants/constants.js";

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
			<h2 className={styles["heading"]}>
				{PromptDeliveryViewLabel.EXPLANATION_HEADING}
			</h2>
			{hasExplanation && <p className={styles["explanation"]}>{explanation}</p>}
			{hasSources && (
				<>
					<h3 className={styles["sources-heading"]}>
						{PromptDeliveryViewLabel.SOURCES_HEADING}
					</h3>
					<ol className={styles["sources"]}>
						{sources.map((source) => (
							<li key={source.promptId} value={source.rank}>
								{source.taskIntent}
							</li>
						))}
					</ol>
				</>
			)}
		</PromptDeliveryCard>
	);
};

export { ExplanationSection };
