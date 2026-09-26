import { z } from "zod";

import { promptStreakQueryValidationSchema } from "../validation-schemas/validation-schemas.js";

type PromptStreakQueryDto = z.infer<typeof promptStreakQueryValidationSchema>;
export { type PromptStreakQueryDto };
