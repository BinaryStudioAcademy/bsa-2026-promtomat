type PromptRepositoryItem = {
	computedScore: null | number;
	createdAt: string;
	efficiencyScore: null | number;
	id: number;
	labelId: number;
	myScore?: null | number;
	promptBody: string;
	taskIntent: string;
	updatedAt: string;
	userId: number;
	workspaceId: number;
	workspaceName: string;
};

export { type PromptRepositoryItem };
