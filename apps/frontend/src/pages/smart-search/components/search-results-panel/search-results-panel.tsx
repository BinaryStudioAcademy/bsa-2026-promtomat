import React from "react";

import { type PromptSearchResult } from "~/modules/prompts/prompts.js";

import { EmptyResultsCta } from "./components/empty-results-cta/empty-results-cta.js";
import { SuggestionRow } from "./components/suggestion-row/suggestion-row.js";
import styles from "./styles.module.css";

const NO_RESULTS_LENGTH = 0;

type Properties = {
	items: PromptSearchResult[];
};

const SearchResultsPanel: React.FC<Properties> = ({ items }) => {
	if (items.length === NO_RESULTS_LENGTH) {
		return <EmptyResultsCta />;
	}

	return (
		<div className={styles["panel"]}>
			{items.map((item) => (
				<SuggestionRow
					efficiencyScore={item.efficiencyScore}
					key={item.promptId}
					promptId={item.promptId}
					taskIntent={item.taskIntent}
				/>
			))}
		</div>
	);
};

export { SearchResultsPanel };
