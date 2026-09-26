const PromptsApiPath = {
	$ID: "/:id",
	$PROMPT_ID_BODY: "/:promptId/body",
	$PROMPT_ID_INTENT: "/:promptId/intent",
	$PROMPT_ID_SCORE: "/:promptId/score",
	RECENT: "/recent",
	ROOT: "/",
	SEARCH: "/search",
	STREAK: "/streak",
} as const;

export { PromptsApiPath };
