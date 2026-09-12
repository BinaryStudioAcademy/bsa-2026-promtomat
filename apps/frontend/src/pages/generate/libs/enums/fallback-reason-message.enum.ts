import { type ValueOf } from "~/libs/types/types.js";
import { FallbackReason } from "~/modules/composed-prompts/composed-prompts.js";

const FallbackReasonMessage: Record<ValueOf<typeof FallbackReason>, string> = {
	[FallbackReason.TIMEOUT]: "The model took too long to answer.",
	[FallbackReason.UNAVAILABLE]: "The model is unavailable right now.",
	[FallbackReason.UNUSABLE]: "The model returned nothing usable.",
};

export { FallbackReasonMessage };
