type EvaluationResponseDto = {
	computedScore: null | number;
	score: number;
	targetId: number;
	targetType: "composed-prompt" | "prompt";
};

export { type EvaluationResponseDto };
