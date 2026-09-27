import { type ValueOf } from "../../../../libs/types/types.js";
import { type EvaluationTargetType } from "../enums/enums.js";

type EvaluationResponseDto = {
	computedScore: null | number;
	score: number;
	targetId: number;
	targetType: ValueOf<typeof EvaluationTargetType>;
};

export { type EvaluationResponseDto };
