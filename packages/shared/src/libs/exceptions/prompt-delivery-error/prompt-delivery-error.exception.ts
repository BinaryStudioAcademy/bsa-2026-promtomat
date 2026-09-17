import { PromptsErrorMessage } from "../../../modules/prompts/prompts.js";
import { ErrorCode } from "../../enums/error-code.enum.js";
import { HTTPCode } from "../../modules/http/http.js";
import { type ValueOf } from "../../types/value-of.type.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof ErrorCode>;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class PromptDeliveryError extends HTTPError {
	public constructor({ cause, code, message, status }: Constructor) {
		super({ cause, code, message, status });
	}

	public static notFound(): PromptDeliveryError {
		return new PromptDeliveryError({
			code: ErrorCode.NOT_FOUND,
			message: PromptsErrorMessage.NOT_FOUND,
			status: HTTPCode.NOT_FOUND,
		});
	}
}

export { PromptDeliveryError };
