import { z } from "zod";

import { type ComposedPromptDto } from "../types/types.js";
import { composedPromptSource } from "./composed-prompt-source.validation-schema.js";

const composedPrompt: z.ZodType<ComposedPromptDto> = z.object({
	body: z.string(),
	computedScore: z.number().nullable(),
	createdAt: z.string(),
	description: z.string(),
	explanation: z.string(),
	id: z.number(),
	modelId: z.string(),
	sources: z.array(composedPromptSource),
	workspaceId: z.number(),
});

export { composedPrompt };
