type PromptItemResponseDto = {
	body: string;
	createdAt: string;
	id: string;
	intent: string;
	keywords: string[];
	score: number;
	workspaceId: string;
	workspaceName: string;
};

export { type PromptItemResponseDto };
