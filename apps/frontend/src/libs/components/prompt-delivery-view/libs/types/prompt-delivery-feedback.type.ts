type PromptDeliveryFeedback = {
	hint?: string;
	label: string;
	onScoreSelect: (score: number) => () => void;
};

export { type PromptDeliveryFeedback };
