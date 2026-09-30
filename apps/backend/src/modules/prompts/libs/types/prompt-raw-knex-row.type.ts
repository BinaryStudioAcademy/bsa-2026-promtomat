type PromptRawKnexRow = {
	computedScore: null | string;
	createdAt: string;
	efficiencyScore: number;
	id: number;
	myScore?: null | number;
	promptBody: string;
	taskIntent: string;
	userId: number;
	workspaceId: number;
	workspaceName: string;
};

export { type PromptRawKnexRow };
