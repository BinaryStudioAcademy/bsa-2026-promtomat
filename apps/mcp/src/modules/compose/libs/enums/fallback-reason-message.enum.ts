import { FallbackReason } from "@promptomat/shared";

import { type ValueOf } from "~/libs/types/types.js";

const FallbackReasonMessage: Record<ValueOf<typeof FallbackReason>, string> = {
	[FallbackReason.TIMEOUT]: "the model took too long to answer.",
	[FallbackReason.UNAVAILABLE]: "the model is unavailable right now.",
	[FallbackReason.UNUSABLE]: "the model returned nothing usable.",
};

export { FallbackReasonMessage };
