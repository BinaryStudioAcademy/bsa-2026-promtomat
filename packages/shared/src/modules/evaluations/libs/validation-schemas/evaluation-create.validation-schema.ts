import { z } from "zod";

import {
	EvaluationTargetType,
	EvaluationValidationRule,
} from "../enums/enums.js";
import { type EvaluationCreateRequestDto } from "../types/types.js";

const evaluationCreate: z.ZodType<EvaluationCreateRequestDto> = z.object({
	score: z
		.number()
		.int()
		.min(EvaluationValidationRule.SCORE_MIN)
		.max(EvaluationValidationRule.SCORE_MAX),
	targetId: z.number().int().positive(),
	targetType: z.enum(EvaluationTargetType),
});

export { evaluationCreate };
