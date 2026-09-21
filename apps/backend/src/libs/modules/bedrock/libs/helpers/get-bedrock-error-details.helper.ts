import { type BedrockErrorDetails } from "../types/types.js";

type ErrorMetadata = {
	attempts?: number;
	httpStatusCode?: number;
	requestId?: string;
};

const checkIsRecord = (
	value: unknown,
): value is Record<number | string | symbol, unknown> => {
	return typeof value === "object" && value !== null;
};

const getErrorMetadata = (error: unknown): ErrorMetadata | null => {
	if (!checkIsRecord(error)) {
		return null;
	}

	const metadata = error["$metadata"];

	return checkIsRecord(metadata) ? metadata : null;
};

const getBedrockErrorDetails = (error: unknown): BedrockErrorDetails => {
	const metadata = getErrorMetadata(error);
	const cause = error instanceof Error ? error.cause : null;

	return {
		attempts: metadata?.attempts ?? null,
		causeMessage: cause instanceof Error ? cause.message : null,
		causeName: cause instanceof Error ? cause.name : null,
		httpStatusCode: metadata?.httpStatusCode ?? null,
		message: error instanceof Error ? error.message : String(error),
		name: error instanceof Error ? error.name : null,
		requestId: metadata?.requestId ?? null,
		stack: error instanceof Error ? (error.stack ?? null) : null,
	};
};

export { getBedrockErrorDetails };
