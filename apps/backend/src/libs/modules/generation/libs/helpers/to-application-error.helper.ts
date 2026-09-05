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

import { GenerationErrorMessage } from "../enums/enums.js";
import {
	GenerationConfigError,
	GenerationError,
} from "../exceptions/exceptions.js";

const toApplicationError = (error: unknown): GenerationError => {
	if (
		error instanceof InternalServerException ||
		error instanceof ModelNotReadyException ||
		error instanceof ModelTimeoutException ||
		error instanceof ServiceUnavailableException ||
		error instanceof ThrottlingException
	) {
		return new GenerationError(GenerationErrorMessage.UNAVAILABLE, error);
	}

	if (
		error instanceof AccessDeniedException ||
		error instanceof ResourceNotFoundException ||
		error instanceof ServiceQuotaExceededException
	) {
		return new GenerationConfigError({ cause: error });
	}

	if (error instanceof ValidationException) {
		return new GenerationError(GenerationErrorMessage.VALIDATION_FAILED, error);
	}

	return new GenerationError(GenerationErrorMessage.UNCLASSIFIED, error);
};

export { toApplicationError };
