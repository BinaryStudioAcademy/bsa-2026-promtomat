type PromptDto = {
	computedScore: null | number;
	efficiencyScore: null | number;
	id: number;
	label: string;
	myScore?: null | number;
	promptBody: string;
	taskIntent: string;
	userId: number;
	workspaceId: number;
};

export { type PromptDto };
