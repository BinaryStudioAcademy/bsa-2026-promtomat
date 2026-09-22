import { z } from "zod";

import { EvaluationValidationRule } from "../enums/enums.js";

type ValidationSchema = {
	composedPromptId: z.ZodOptional<z.ZodNumber>;
	promptId: z.ZodOptional<z.ZodNumber>;
	score: z.ZodNumber;
};

const evaluationCreate = z
	.object<ValidationSchema>({
		composedPromptId: z.number().int().positive().optional(),
		promptId: z.number().int().positive().optional(),
		score: z
			.number()
			.int()
			.min(EvaluationValidationRule.SCORE_MIN)
			.max(EvaluationValidationRule.SCORE_MAX),
	})
	.refine(
		(data) =>
			(Boolean(data.promptId) && !data.composedPromptId) ||
			(!data.promptId && Boolean(data.composedPromptId)),
		{
			message: "Exactly one of promptId or composedPromptId must be provided",
		},
	);

export { evaluationCreate };
