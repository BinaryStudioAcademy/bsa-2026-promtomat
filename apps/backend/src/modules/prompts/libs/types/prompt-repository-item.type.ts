type PromptRepositoryItem = {
	createdAt: string;
	efficiencyScore: number;
	id: number;
	promptBody: string;
	taskIntent: string;
	updatedAt: string;
	userId: number;
	workspace: {
		name: string;
	};
	workspaceId: number;
};

export { type PromptRepositoryItem };
