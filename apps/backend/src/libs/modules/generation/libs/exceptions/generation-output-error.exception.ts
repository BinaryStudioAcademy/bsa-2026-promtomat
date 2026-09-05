import { GenerationErrorMessage } from "../enums/enums.js";
import { GenerationError } from "./generation-error.exception.js";

class GenerationOutputError extends GenerationError {
	public constructor(cause?: unknown) {
		super(GenerationErrorMessage.OUTPUT_UNUSABLE, cause);
	}
}

export { GenerationOutputError };
