import { z } from "zod";

import { searchPrompts } from "../validation-schemas/search-prompts.validation-schema.js";

type PromptSearchRequestDto = z.infer<typeof searchPrompts>;

export { type PromptSearchRequestDto };
