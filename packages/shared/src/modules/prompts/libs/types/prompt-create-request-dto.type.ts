import { z } from "zod";

import { promptCreateValidationSchema } from "../validation-schemas/validation-schemas.js";

type PromptCreateRequestDto = z.infer<typeof promptCreateValidationSchema>;

export { type PromptCreateRequestDto };
