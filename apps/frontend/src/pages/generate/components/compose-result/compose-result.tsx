import React from "react";

import {
	type ComposeResponseDto,
	ComposeResultKind,
} from "~/modules/composed-prompts/composed-prompts.js";

import { FallbackPromptCard } from "../fallback-prompt-card/fallback-prompt-card.js";
import { NoMatchesNotice } from "../no-matches-notice/no-matches-notice.js";

type Properties = {
	result: Exclude<
		ComposeResponseDto,
		{ kind: typeof ComposeResultKind.COMPOSED }
	>;
};

const ComposeResult: React.FC<Properties> = ({ result }: Properties) => {
	switch (result.kind) {
		case ComposeResultKind.FALLBACK: {
			return (
				<FallbackPromptCard prompt={result.prompt} reason={result.reason} />
			);
		}

		case ComposeResultKind.NO_MATCHES: {
			return <NoMatchesNotice />;
		}
	}
};

export { ComposeResult };
