type PromptItemResponseDto = {
	body: string;
	computedScore: null | number;
	createdAt: string;
	id: number;
	intent: string;
	myScore?: null | number;
	score: null | number;
	userId: number;
	workspaceId: number;
	workspaceName: string;
};

export { type PromptItemResponseDto };
