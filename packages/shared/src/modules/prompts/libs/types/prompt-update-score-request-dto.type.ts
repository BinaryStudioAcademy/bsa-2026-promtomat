import { z } from "zod";

import { promptUpdateScoreValidationSchema } from "../validation-schemas/validation-schemas.js";

type PromptUpdateScoreRequestDto = z.infer<
	typeof promptUpdateScoreValidationSchema
>;

export { type PromptUpdateScoreRequestDto };
