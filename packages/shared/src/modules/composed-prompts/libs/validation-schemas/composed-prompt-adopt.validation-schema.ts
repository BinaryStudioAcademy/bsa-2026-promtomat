import { z } from "zod";

import { promptCreateValidationSchema } from "../../../prompts/libs/validation-schemas/validation-schemas.js";

const composedPromptAdopt = z.object({
	promptBody: promptCreateValidationSchema.shape.promptBody.optional(),
	score: promptCreateValidationSchema.shape.efficiencyScore,
});

export { composedPromptAdopt };
