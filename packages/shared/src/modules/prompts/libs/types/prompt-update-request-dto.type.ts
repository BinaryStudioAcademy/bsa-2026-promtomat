import { z } from "zod";

import { promptUpdateValidationSchema } from "../validation-schemas/validation-schemas.js";

type PromptUpdateRequestDto = z.infer<typeof promptUpdateValidationSchema>;

export { type PromptUpdateRequestDto };
