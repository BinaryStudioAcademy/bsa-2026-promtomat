import { ApplicationError } from "~/libs/exceptions/exceptions.js";

import { ComposedPromptErrorMessage } from "../enums/enums.js";

class ComposedPromptDuplicateError extends ApplicationError {
	public constructor(cause?: unknown) {
		super({ cause, message: ComposedPromptErrorMessage.DUPLICATE });
	}
}

export { ComposedPromptDuplicateError };
