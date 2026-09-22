import { z } from "zod";

const SCORE_MIN = 1;
const SCORE_MAX = 10;

type ValidationSchema = {
	composedPromptId: z.ZodOptional<z.ZodNumber>;
	promptId: z.ZodOptional<z.ZodNumber>;
	score: z.ZodNumber;
};

const evaluationCreate = z
	.object<ValidationSchema>({
		composedPromptId: z.number().int().positive().optional(),
		promptId: z.number().int().positive().optional(),
		score: z.number().int().min(SCORE_MIN).max(SCORE_MAX),
	})
	.refine(
		(data) =>
			(data.promptId !== undefined && data.composedPromptId === undefined) ||
			(data.promptId === undefined && data.composedPromptId !== undefined),
		{
			message: "Exactly one of promptId or composedPromptId must be provided",
		},
	);

export { evaluationCreate };
