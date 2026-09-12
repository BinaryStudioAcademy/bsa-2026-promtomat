import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import {
	PromptsErrorCode,
	PromptsErrorMessage,
} from "../../../modules/prompts/prompts.js";
import { ErrorCode } from "../../enums/error-code.enum.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof ErrorCode>;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class PromptSearchError extends HTTPError {
	public constructor({ cause, code, message, status }: Constructor) {
		super({ cause, code, message, status });
	}

	public static unavailable(): PromptSearchError {
		return new PromptSearchError({
			code: PromptsErrorCode.SERVICE_UNAVAILABLE,
			message: PromptsErrorMessage.SERVICE_UNAVAILABLE,
			status: HTTPCode.SERVICE_UNAVAILABLE,
		});
	}
}

export { PromptSearchError };
