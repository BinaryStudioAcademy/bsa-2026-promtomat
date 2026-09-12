import { ApplicationError } from "~/libs/exceptions/exceptions.js";
import { type ValueOf } from "~/libs/types/types.js";

import {
	BedrockServiceErrorCode,
	BedrockServiceErrorMessage,
} from "../enums/enums.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof BedrockServiceErrorCode>;
	message: string;
};

class BedrockServiceError extends ApplicationError {
	public code: ValueOf<typeof BedrockServiceErrorCode>;

	public constructor({ cause, code, message }: Constructor) {
		super({
			cause,
			message,
		});

		this.code = code;
	}

	public static configInvalid(cause?: unknown): BedrockServiceError {
		return new BedrockServiceError({
			cause,
			code: BedrockServiceErrorCode.CONFIG_INVALID,
			message: BedrockServiceErrorMessage.CONFIG_INVALID,
		});
	}

	public static unavailable(cause?: unknown): BedrockServiceError {
		return new BedrockServiceError({
			cause,
			code: BedrockServiceErrorCode.UNAVAILABLE,
			message: BedrockServiceErrorMessage.UNAVAILABLE,
		});
	}

	public static unclassified(cause?: unknown): BedrockServiceError {
		return new BedrockServiceError({
			cause,
			code: BedrockServiceErrorCode.UNCLASSIFIED,
			message: BedrockServiceErrorMessage.UNCLASSIFIED,
		});
	}

	public static validationFailed(cause?: unknown): BedrockServiceError {
		return new BedrockServiceError({
			cause,
			code: BedrockServiceErrorCode.VALIDATION_FAILED,
			message: BedrockServiceErrorMessage.VALIDATION_FAILED,
		});
	}
}

export { BedrockServiceError };
