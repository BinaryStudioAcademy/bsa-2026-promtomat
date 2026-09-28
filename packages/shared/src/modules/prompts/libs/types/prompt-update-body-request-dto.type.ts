import { z } from "zod";

import { promptUpdateBodyValidationSchema } from "../validation-schemas/validation-schemas.js";

type PromptUpdateBodyRequestDto = z.infer<
	typeof promptUpdateBodyValidationSchema
>;

export { type PromptUpdateBodyRequestDto };
