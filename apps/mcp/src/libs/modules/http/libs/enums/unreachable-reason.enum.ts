const UnreachableReason = {
	NETWORK_FAILURE: "the network request failed",
	TIMEOUT: "the request timed out",
} as const;

export { UnreachableReason };
