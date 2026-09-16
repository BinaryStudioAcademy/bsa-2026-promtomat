const ModelCallOutcome = {
	COMPOSED: "composed",
	DEDUPLICATED: "deduplicated",
	FALLBACK_TIMEOUT: "fallback:timeout",
	FALLBACK_UNAVAILABLE: "fallback:unavailable",
	FALLBACK_UNUSABLE: "fallback:unusable",
} as const;

export { ModelCallOutcome };
