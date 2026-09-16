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

class PromptError extends HTTPError {
	public constructor({ cause, code, message, status }: Constructor) {
		super({
			cause,
			code,
			message,
			status,
		});
	}

	public static failedToCreate(cause?: unknown): PromptError {
		return new PromptError({
			cause,
			code: PromptsErrorCode.FAILED_TO_CREATE,
			message: PromptsErrorMessage.FAILED_TO_CREATE,
			status: HTTPCode.SERVICE_UNAVAILABLE,
		});
	}
}

export { PromptError };
