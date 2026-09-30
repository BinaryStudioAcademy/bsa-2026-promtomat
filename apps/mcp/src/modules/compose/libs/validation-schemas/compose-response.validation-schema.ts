import { z } from "zod";

import { ComposeResultKind, FallbackReason } from "../enums/enums.js";
import { type ComposeResponseDto } from "../types/types.js";
import { composedPrompt } from "./composed-prompt.validation-schema.js";
import { promptCandidate } from "./prompt-candidate.validation-schema.js";

const composeResponse: z.ZodType<ComposeResponseDto> = z.discriminatedUnion(
	"kind",
	[
		z.object({
			composedPrompt,
			kind: z.literal(ComposeResultKind.COMPOSED),
			remainingRecompositions: z.number(),
		}),
		z.object({
			kind: z.literal(ComposeResultKind.FALLBACK),
			prompt: promptCandidate,
			reason: z.enum(FallbackReason),
		}),
		z.object({
			kind: z.literal(ComposeResultKind.NO_MATCHES),
		}),
	],
);

export { composeResponse };
