type PromptRepositoryItem = {
	createdAt: string;
	efficiencyScore: number;
	id: number;
	promptBody: string;
	taskIntent: string;
	workspace: {
		name: string;
	};
	workspaceId: number;
};

export { type PromptRepositoryItem };
