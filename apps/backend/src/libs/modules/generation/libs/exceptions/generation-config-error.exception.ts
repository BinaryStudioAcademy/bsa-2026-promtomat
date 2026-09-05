import { GenerationErrorMessage } from "../enums/enums.js";
import { GenerationError } from "./generation-error.exception.js";

class GenerationConfigError extends GenerationError {
	public constructor(cause: unknown) {
		super(GenerationErrorMessage.CONFIG_INVALID, cause);
	}
}

export { GenerationConfigError };
