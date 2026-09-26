const PromptsApiPath = {
	$ID: "/:id",
	$PROMPT_ID_BODY: "/:promptId/body",
	$PROMPT_ID_INTENT: "/:promptId/intent",
	$PROMPT_ID_SCORE: "/:promptId/score",
	PROGRESS: "/progress",
	RECENT: "/recent",
	ROOT: "/",
	SEARCH: "/search",
} as const;

export { PromptsApiPath };
