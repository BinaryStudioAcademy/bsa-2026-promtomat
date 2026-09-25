import React from "react";

import {
	type ComposeResponseDto,
	ComposeResultKind,
} from "~/modules/composed-prompts/composed-prompts.js";

import { ComposedResultCard } from "../composed-result-card/composed-result-card.js";
import { FallbackPromptCard } from "../fallback-prompt-card/fallback-prompt-card.js";
import { NoMatchesNotice } from "../no-matches-notice/no-matches-notice.js";

type Properties = {
	onTryAgain: () => void;
	result: ComposeResponseDto;
};

const ComposeResult: React.FC<Properties> = ({
	onTryAgain,
	result,
}: Properties) => {
	switch (result.kind) {
		case ComposeResultKind.COMPOSED: {
			return <ComposedResultCard composedPrompt={result.composedPrompt} />;
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
