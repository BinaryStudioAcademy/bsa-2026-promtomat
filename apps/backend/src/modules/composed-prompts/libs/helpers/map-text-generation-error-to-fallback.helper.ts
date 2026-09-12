import {
	checkIsTimeoutError,
	type TextGenerationError,
	TextGenerationErrorCode,
} from "~/libs/modules/bedrock/bedrock.js";

import { FallbackReason } from "../enums/enums.js";
import { type FallbackMapping } from "../types/types.js";

const mapTextGenerationErrorToFallback = (
	error: TextGenerationError,
): FallbackMapping => {
	switch (error.code) {
		case TextGenerationErrorCode.OUTPUT_UNUSABLE:
		case TextGenerationErrorCode.VALIDATION_FAILED: {
			return { isConfigurationFault: false, reason: FallbackReason.UNUSABLE };
		}

		case TextGenerationErrorCode.UNAVAILABLE: {
			return {
				isConfigurationFault: false,
				reason: checkIsTimeoutError(error.cause)
					? FallbackReason.TIMEOUT
					: FallbackReason.UNAVAILABLE,
			};
		}

		default: {
			return { isConfigurationFault: true, reason: FallbackReason.UNAVAILABLE };
		}
	}
};

export { mapTextGenerationErrorToFallback };
