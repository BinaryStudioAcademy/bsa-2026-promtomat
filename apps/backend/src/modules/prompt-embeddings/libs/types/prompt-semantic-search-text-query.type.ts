type PromptSemanticSearchTextQuery = {
	limit: number;
	offset: number;
	score?: number | undefined;
	search: string;
	userId: number;
	workspaceId?: number | undefined;
};

export { type PromptSemanticSearchTextQuery };
