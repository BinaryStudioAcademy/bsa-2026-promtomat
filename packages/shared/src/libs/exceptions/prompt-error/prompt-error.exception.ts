import { HTTPCode } from "../../../libs/modules/http/http.js";
import {
	PromptsErrorCode,
	PromptsErrorMessage,
} from "../../../modules/prompts/prompts.js";
import { HTTPError } from "../http-error/http-error.exception.js";

class PromptError extends HTTPError {
	public static notFound(): PromptError {
		return new PromptError({
			code: PromptsErrorCode.NOT_FOUND,
			message: PromptsErrorMessage.NOT_FOUND,
			status: HTTPCode.NOT_FOUND,
		});
	}
}

export { PromptError };
