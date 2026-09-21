import { type BedrockErrorDetails } from "../types/types.js";

type ErrorMetadata = {
	attempts?: number;
	httpStatusCode?: number;
	requestId?: string;
};

const checkIsRecord = (value: unknown): value is Record<string, unknown> => {
	return typeof value === "object" && value !== null;
};

const getErrorMetadata = (error: unknown): ErrorMetadata | undefined => {
	if (!checkIsRecord(error)) {
		return undefined;
	}

	const metadata = error["$metadata"];

	return checkIsRecord(metadata) ? metadata : undefined;
};

const getBedrockErrorDetails = (error: unknown): BedrockErrorDetails => {
	const metadata = getErrorMetadata(error);
	const cause = error instanceof Error ? error.cause : undefined;

	return {
		attempts: metadata?.attempts,
		causeMessage: cause instanceof Error ? cause.message : undefined,
		causeName: cause instanceof Error ? cause.name : undefined,
		httpStatusCode: metadata?.httpStatusCode,
		message: error instanceof Error ? error.message : String(error),
		name: error instanceof Error ? error.name : undefined,
		requestId: metadata?.requestId,
		stack: error instanceof Error ? error.stack : undefined,
	};
};

export { getBedrockErrorDetails };
