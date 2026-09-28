import { ComposeResultKind, ComposeResultMessage } from "../enums/enums.js";
import { type ComposeResponseDto } from "../types/types.js";
import { formatComposedResult } from "./format-composed-result.helper.js";
import { formatFallbackResult } from "./format-fallback-result.helper.js";
import { getComposedPromptUrl } from "./get-composed-prompt-url.helper.js";
import { getPromptUrl } from "./get-prompt-url.helper.js";

const formatComposeResponse = (
	response: ComposeResponseDto,
	webUrl: string,
): string => {
	switch (response.kind) {
		case ComposeResultKind.COMPOSED: {
			return formatComposedResult(
				response.composedPrompt,
				getComposedPromptUrl(webUrl, response.composedPrompt.id),
			);
		}

		case ComposeResultKind.FALLBACK: {
			return formatFallbackResult(
				response.prompt,
				response.reason,
				getPromptUrl(webUrl, response.prompt.promptId),
			);
		}

		case ComposeResultKind.NO_MATCHES: {
			return ComposeResultMessage.NO_MATCHES;
		}
	}
};

export { formatComposeResponse };
