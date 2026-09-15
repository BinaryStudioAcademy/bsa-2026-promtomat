import {
	AccessDeniedException,
	InternalServerException,
	ModelNotReadyException,
	ModelTimeoutException,
	ResourceNotFoundException,
	ServiceQuotaExceededException,
	ServiceUnavailableException,
	ThrottlingException,
	ValidationException,
} from "@aws-sdk/client-bedrock-runtime";

import { BedrockServiceError } from "../exceptions/exceptions.js";

const convertToBedrockServiceError = (error: unknown): BedrockServiceError => {
	if (
		error instanceof InternalServerException ||
		error instanceof ModelNotReadyException ||
		error instanceof ModelTimeoutException ||
		error instanceof ServiceUnavailableException ||
		error instanceof ThrottlingException
	) {
		return BedrockServiceError.unavailable(error);
	}

	if (
		error instanceof AccessDeniedException ||
		error instanceof ResourceNotFoundException ||
		error instanceof ServiceQuotaExceededException
	) {
		return BedrockServiceError.configInvalid(error);
	}

	if (error instanceof ValidationException) {
		return BedrockServiceError.validationFailed(error);
	}

	return BedrockServiceError.unclassified(error);
};

export { convertToBedrockServiceError };
