import { type z } from "zod";

import { type composedPromptGetQuery } from "../validation-schemas/composed-prompt-get-query.validation-schema.js";

type ComposedPromptGetQueryDto = z.infer<typeof composedPromptGetQuery>;

export { type ComposedPromptGetQueryDto };
