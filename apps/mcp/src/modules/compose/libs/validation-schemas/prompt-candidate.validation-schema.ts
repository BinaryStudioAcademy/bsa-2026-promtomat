import { z } from "zod";

import { type PromptCandidateDto } from "../types/types.js";

const promptCandidate: z.ZodType<PromptCandidateDto> = z.object({
	efficiencyScore: z.number(),
	promptBody: z.string(),
	promptId: z.number(),
	taskIntent: z.string(),
});

export { promptCandidate };
