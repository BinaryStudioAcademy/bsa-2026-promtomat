import { type z } from "zod";

import { type promptGetQueryValidationSchema } from "../validation-schemas/validation-schemas.js";

type PromptGetQueryDto = z.infer<typeof promptGetQueryValidationSchema>;

export { type PromptGetQueryDto };
