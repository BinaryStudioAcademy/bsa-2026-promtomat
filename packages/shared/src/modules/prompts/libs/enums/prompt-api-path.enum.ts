const PromptsApiPath = {
	INTENT: "/:promptId/intent",
	PROGRESS: "/progress",
	RECENT: "/recent",
	ROOT: "/",
	SEARCH: "/search",
} as const;

export { PromptsApiPath };
