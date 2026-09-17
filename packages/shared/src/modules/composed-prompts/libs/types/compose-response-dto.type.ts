import { type ValueOf } from "../../../../libs/types/value-of.type.js";
import { type ComposeResultKind } from "../enums/compose-result-kind.enum.js";
import { type FallbackReason } from "../enums/fallback-reason.enum.js";
import { type ComposedPromptDto } from "./composed-prompt-dto.type.js";
import { type PromptCandidateDto } from "./prompt-candidate-dto.type.js";

type ComposedResultDto = {
	composedPrompt: ComposedPromptDto;
	kind: typeof ComposeResultKind.COMPOSED;
};

type ComposeResponseDto =
	ComposedResultDto | FallbackResultDto | NoMatchesResultDto;

type FallbackResultDto = {
	kind: typeof ComposeResultKind.FALLBACK;
	prompt: PromptCandidateDto;
	reason: ValueOf<typeof FallbackReason>;
};

type NoMatchesResultDto = {
	kind: typeof ComposeResultKind.NO_MATCHES;
};

export { type ComposeResponseDto };
