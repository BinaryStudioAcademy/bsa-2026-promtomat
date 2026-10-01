type PromptHistoryRawRow = {
	body: string;
	computedScore: null | string;
	createdAt: string;
	id: number;
	intent: string;
	isComposed: boolean;
	myScore: null | number;
	score: number;
	userId: number;
	workspaceId: number;
};

export { type PromptHistoryRawRow };
