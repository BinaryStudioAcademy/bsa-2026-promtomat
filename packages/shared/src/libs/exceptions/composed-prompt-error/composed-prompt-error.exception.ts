import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import {
	ComposedPromptsErrorCode,
	ComposedPromptsErrorMessage,
} from "../../../modules/composed-prompts/composed-prompts.js";
import { type ErrorCode } from "../../enums/error-code.enum.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof ErrorCode>;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class ComposedPromptError extends HTTPError {
	public constructor({ cause, code, message, status }: Constructor) {
		super({
			cause,
			code,
			message,
			status,
		});
	}

	public static notFound(): ComposedPromptError {
		return new ComposedPromptError({
			code: ComposedPromptsErrorCode.COMPOSED_PROMPT_NOT_FOUND,
			message: ComposedPromptsErrorMessage.NOT_FOUND,
			status: HTTPCode.NOT_FOUND,
		});
	}
}

export { ComposedPromptError };
