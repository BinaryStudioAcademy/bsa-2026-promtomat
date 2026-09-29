import React from "react";

import {
	type ComposeResponseDto,
	ComposeResultKind,
} from "~/modules/composed-prompts/composed-prompts.js";

import { ComposedResultCard } from "../composed-result-card/composed-result-card.js";
import { FallbackPromptCard } from "../fallback-prompt-card/fallback-prompt-card.js";
import { NoMatchesNotice } from "../no-matches-notice/no-matches-notice.js";

type Properties = {
	onDiscard: () => void;
	onRecompose: () => void;
	onTryAgain: () => void;
	result: ComposeResponseDto;
};

const ComposeResult: React.FC<Properties> = ({
	onDiscard,
	onRecompose,
	onTryAgain,
	result,
}: Properties) => {
	switch (result.kind) {
		case ComposeResultKind.COMPOSED: {
			return (
				<ComposedResultCard
					composedPrompt={result.composedPrompt}
					key={result.composedPrompt.id}
					onDiscard={onDiscard}
					onRecompose={onRecompose}
					remainingRecompositions={result.remainingRecompositions}
				/>
			);
		}

		case ComposeResultKind.FALLBACK: {
			return (
				<FallbackPromptCard
					onTryAgain={onTryAgain}
					prompt={result.prompt}
					reason={result.reason}
				/>
			);
		}

		case ComposeResultKind.NO_MATCHES: {
			return <NoMatchesNotice />;
		}
	}
};

export { ComposeResult };
