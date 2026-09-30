type PromptWorkspaceRawRow = {
	computedScore: null | string;
	efficiencyScore: number;
	id: number;
	label: string;
	myScore?: null | number;
	promptBody: string;
	taskIntent: string;
	userId: number;
	workspaceId: number;
};

export { type PromptWorkspaceRawRow };
