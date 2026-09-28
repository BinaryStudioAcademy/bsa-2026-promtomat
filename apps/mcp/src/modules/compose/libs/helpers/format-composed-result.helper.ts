import { EMPTY_LENGTH } from "../constants/constants.js";
import { ComposeResultMessage } from "../enums/enums.js";
import {
	type ComposedPromptDto,
	type ComposedPromptSourceDto,
} from "../types/types.js";
import { joinBlocks } from "./join-blocks.helper.js";

const formatSource = ({
	promptId,
	rank,
	taskIntent,
}: ComposedPromptSourceDto): string =>
	`  ${String(rank)}. Prompt #${String(promptId)}: ${taskIntent}`;

const formatSources = (sources: ComposedPromptSourceDto[]): string[] => {
	if (sources.length === EMPTY_LENGTH) {
		return [ComposeResultMessage.NO_SOURCES];
	}

	return [
		ComposeResultMessage.SOURCES_LABEL,
		...sources.map((source) => formatSource(source)),
	];
};

const formatComposedResult = (
	{ body, createdAt, explanation, id, sources }: ComposedPromptDto,
	composedPromptUrl: string,
): string => {
	return joinBlocks([
		[
			ComposeResultMessage.COMPOSED_HEADLINE,
			`${ComposeResultMessage.COMPOSED_AT_LABEL} ${createdAt}`,
			`${ComposeResultMessage.COMPOSED_ID_LABEL} ${String(id)}. ${ComposeResultMessage.COMPOSED_ID_NOTE}`,
			`${ComposeResultMessage.PROMPT_URL_LABEL} ${composedPromptUrl}`,
		],
		[
			ComposeResultMessage.COMPOSED_PROMPT_BEGIN,
			body,
			ComposeResultMessage.COMPOSED_PROMPT_END,
		],
		[ComposeResultMessage.EXPLANATION_LABEL, explanation.trim()],
		formatSources(sources),
		[ComposeResultMessage.COMPOSED_USAGE_HINT],
	]);
};

export { formatComposedResult };
