import { ApplicationError } from "~/libs/exceptions/exceptions.js";
import { type ValueOf } from "~/libs/types/types.js";

import { GenerationErrorCode, GenerationErrorMessage } from "../enums/enums.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof GenerationErrorCode>;
	message: string;
};

class GenerationError extends ApplicationError {
	public code: ValueOf<typeof GenerationErrorCode>;

	public constructor({ cause, code, message }: Constructor) {
		super({
			cause,
			message,
		});

		this.code = code;
	}

	public static outputUnusable(cause?: unknown): GenerationError {
		return new GenerationError({
			cause,
			code: GenerationErrorCode.OUTPUT_UNUSABLE,
			message: GenerationErrorMessage.OUTPUT_UNUSABLE,
		});
	}
}

export { GenerationError };
