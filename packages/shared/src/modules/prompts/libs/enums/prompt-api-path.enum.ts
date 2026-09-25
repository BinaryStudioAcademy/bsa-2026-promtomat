const PromptsApiPath = {
	$ID: "/:id",
	$PROMPT_ID_INTENT: "/:promptId/intent",
	RECENT: "/recent",
	ROOT: "/",
	SEARCH: "/search",
} as const;

export { PromptsApiPath };
