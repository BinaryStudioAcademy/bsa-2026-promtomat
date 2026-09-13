import {
	AccessDeniedException,
	InternalServerException,
	ModelErrorException,
	ModelNotReadyException,
	ModelStreamErrorException,
	ModelTimeoutException,
	ResourceNotFoundException,
	ServiceQuotaExceededException,
	ServiceUnavailableException,
	ThrottlingException,
	ValidationException,
} from "@aws-sdk/client-bedrock-runtime";

import { TextGenerationError } from "../exceptions/exceptions.js";
import { checkIsTimeoutError } from "./check-is-timeout-error.helper.js";

const convertBedrockErrorToTextGenerationError = (
	error: unknown,
): TextGenerationError => {
	if (
		checkIsTimeoutError(error) ||
		error instanceof InternalServerException ||
		error instanceof ModelErrorException ||
		error instanceof ModelNotReadyException ||
		error instanceof ModelStreamErrorException ||
		error instanceof ModelTimeoutException ||
		error instanceof ServiceUnavailableException ||
		error instanceof ThrottlingException
	) {
		return TextGenerationError.unavailable(error);
	}

	if (
		error instanceof AccessDeniedException ||
		error instanceof ResourceNotFoundException ||
		error instanceof ServiceQuotaExceededException
	) {
		return TextGenerationError.configInvalid(error);
	}

	if (error instanceof ValidationException) {
		return TextGenerationError.validationFailed(error);
	}

	return TextGenerationError.unclassified(error);
};

export { convertBedrockErrorToTextGenerationError };
