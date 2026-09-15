const BedrockServiceErrorMessage = {
	CONFIG_INVALID: "Bedrock is not configured correctly.",
	UNAVAILABLE: "Bedrock is temporarily unavailable.",
	UNCLASSIFIED: "The Bedrock request failed for an unrecognized reason.",
	VALIDATION_FAILED: "Bedrock rejected the request as invalid.",
} as const;

export { BedrockServiceErrorMessage };
