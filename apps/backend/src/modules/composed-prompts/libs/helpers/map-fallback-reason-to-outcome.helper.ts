import { type ValueOf } from "~/libs/types/types.js";

import { FallbackReason, ModelCallOutcome } from "../enums/enums.js";

const outcomes = {
	[FallbackReason.TIMEOUT]: ModelCallOutcome.FALLBACK_TIMEOUT,
	[FallbackReason.UNAVAILABLE]: ModelCallOutcome.FALLBACK_UNAVAILABLE,
	[FallbackReason.UNUSABLE]: ModelCallOutcome.FALLBACK_UNUSABLE,
} as const;

const mapFallbackReasonToOutcome = (
	reason: ValueOf<typeof FallbackReason>,
): ValueOf<typeof ModelCallOutcome> => outcomes[reason];

export { mapFallbackReasonToOutcome };
