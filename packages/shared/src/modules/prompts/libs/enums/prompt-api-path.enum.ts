const PromptsApiPath = {
	$ID: "/:id",
	$PROMPT_ID_INTENT: "/:promptId/intent",
	RECENT: "/recent",
	ROOT: "/",
	SEARCH: "/search",
	STREAK: "/streak",
} as const;

export { PromptsApiPath };
