import { z } from "zod";

import { type ComposedPromptSourceDto } from "../types/types.js";

const composedPromptSource: z.ZodType<ComposedPromptSourceDto> = z.object({
	promptId: z.number(),
	rank: z.number(),
	taskIntent: z.string(),
});

export { composedPromptSource };
