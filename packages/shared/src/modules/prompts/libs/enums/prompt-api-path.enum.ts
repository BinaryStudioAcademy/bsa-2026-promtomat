const PromptsApiPath = {
	$PROMPT_ID_INTENT: "/:promptId/intent",
	PROGRESS: "/progress",
	RECENT: "/recent",
	ROOT: "/",
	SEARCH: "/search",
} as const;

export { PromptsApiPath };
