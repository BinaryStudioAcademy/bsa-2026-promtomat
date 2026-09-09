import { ApplicationError } from "~/libs/exceptions/exceptions.js";
import { type ValueOf } from "~/libs/types/types.js";

import {
	TextGenerationErrorCode,
	TextGenerationErrorMessage,
} from "../enums/enums.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof TextGenerationErrorCode>;
	message: string;
};

class TextGenerationError extends ApplicationError {
	public code: ValueOf<typeof TextGenerationErrorCode>;

	public constructor({ cause, code, message }: Constructor) {
		super({
			cause,
			message,
		});

		this.code = code;
	}

	public static maxTokensExceedsAllowedThreshold(
		maxTokens: number,
		cause?: unknown,
	): TextGenerationError {
		return new TextGenerationError({
			cause,
			code: TextGenerationErrorCode.MAX_TOKENS_EXCEEDS_THRESHOLD,
			message: `${TextGenerationErrorMessage.TOKENS_THRESHOLD_EXCEEDED} ${maxTokens.toString()}`,
		});
	}

	public static unableToGenerateStructure(
		cause?: unknown,
	): TextGenerationError {
		return new TextGenerationError({
			cause,
			code: TextGenerationErrorCode.UNABLE_TO_GENERATE_STRUCTURE,
			message: TextGenerationErrorMessage.UNABLE_TO_GENERATE_STRUCTURE,
		});
	}

	public static unableToGenerateText(cause?: unknown): TextGenerationError {
		return new TextGenerationError({
			cause,
			code: TextGenerationErrorCode.UNABLE_TO_GENERATE_TEXT,
			message: TextGenerationErrorMessage.UNABLE_TO_GENERATE_TEXT,
		});
	}
}

export { TextGenerationError };
