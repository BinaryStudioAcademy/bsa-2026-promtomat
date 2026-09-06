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

	public static configInvalid(cause?: unknown): TextGenerationError {
		return new TextGenerationError({
			cause,
			code: TextGenerationErrorCode.CONFIG_INVALID,
			message: TextGenerationErrorMessage.CONFIG_INVALID,
		});
	}

	public static outputUnusable(cause?: unknown): TextGenerationError {
		return new TextGenerationError({
			cause,
			code: TextGenerationErrorCode.OUTPUT_UNUSABLE,
			message: TextGenerationErrorMessage.OUTPUT_UNUSABLE,
		});
	}

	public static unavailable(cause?: unknown): TextGenerationError {
		return new TextGenerationError({
			cause,
			code: TextGenerationErrorCode.UNAVAILABLE,
			message: TextGenerationErrorMessage.UNAVAILABLE,
		});
	}

	public static unclassified(cause?: unknown): TextGenerationError {
		return new TextGenerationError({
			cause,
			code: TextGenerationErrorCode.UNCLASSIFIED,
			message: TextGenerationErrorMessage.UNCLASSIFIED,
		});
	}

	public static validationFailed(cause?: unknown): TextGenerationError {
		return new TextGenerationError({
			cause,
			code: TextGenerationErrorCode.VALIDATION_FAILED,
			message: TextGenerationErrorMessage.VALIDATION_FAILED,
		});
	}
}

export { TextGenerationError };
