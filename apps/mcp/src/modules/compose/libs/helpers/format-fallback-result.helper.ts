import { type ValueOf } from "~/libs/types/types.js";

import {
	ComposeResultMessage,
	type FallbackReason,
	FallbackReasonMessage,
	PromptValidationRule,
} from "../enums/enums.js";
import { type PromptCandidateDto } from "../types/types.js";
import { joinBlocks } from "./join-blocks.helper.js";

const formatFallbackResult = (
	{ efficiencyScore, promptBody, promptId, taskIntent }: PromptCandidateDto,
	reason: ValueOf<typeof FallbackReason>,
	promptUrl: string,
): string =>
	joinBlocks([
		[
			`${ComposeResultMessage.FALLBACK_HEADLINE} ${FallbackReasonMessage[reason]}`,
			ComposeResultMessage.FALLBACK_EXPLANATION,
		],
		[
			`${ComposeResultMessage.STORED_PROMPT_LABEL} Prompt #${String(promptId)}: ${taskIntent}`,
			`${ComposeResultMessage.SCORE_LABEL} ${String(efficiencyScore)} / ${String(PromptValidationRule.EFFICIENCY_SCORE_MAX)}`,
			`${ComposeResultMessage.PROMPT_URL_LABEL} ${promptUrl}`,
		],
		[
			ComposeResultMessage.FALLBACK_PROMPT_BEGIN,
			promptBody,
			ComposeResultMessage.FALLBACK_PROMPT_END,
		],
		[ComposeResultMessage.FALLBACK_USAGE_HINT],
	]);

export { formatFallbackResult };
