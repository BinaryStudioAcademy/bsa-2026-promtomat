import { z } from "zod";

import { promptUpdateIntentValidationSchema } from "../validation-schemas/validation-schemas.js";

type PromptUpdateIntentRequestDto = z.infer<
	typeof promptUpdateIntentValidationSchema
>;

export { type PromptUpdateIntentRequestDto };
