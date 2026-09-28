type PromptDeliveryFeedback = {
	hint?: string;
	isDisabled?: boolean;
	label: string;
	onScoreSelect: (score: number) => () => void;
	selectedScore?: null | number;
};

export { type PromptDeliveryFeedback };
