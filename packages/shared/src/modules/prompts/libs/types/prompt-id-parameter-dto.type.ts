import { type z } from "zod";

import { promptIdParameter } from "../validation-schemas/prompt-id-parameter.validation-schema.js";

type PromptIdParameterDto = z.infer<typeof promptIdParameter>;

export { type PromptIdParameterDto };
