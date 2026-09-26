type PromptScoreUpdatePayload = {
	efficiencyScore: null | number;
};

type PromptTextUpdatePayload = {
	labelId: number;
	promptBody: string;
	taskIntent: string;
};

type PromptUpdatePayload = PromptScoreUpdatePayload | PromptTextUpdatePayload;

export { type PromptUpdatePayload };
