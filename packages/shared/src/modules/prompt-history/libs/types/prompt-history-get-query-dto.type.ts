import { type z } from "zod";

import { type promptHistoryGetQuery } from "../validation-schemas/prompt-history-get-query.validation-schema.js";

type PromptHistoryGetQueryDto = z.infer<typeof promptHistoryGetQuery>;

export { type PromptHistoryGetQueryDto };
