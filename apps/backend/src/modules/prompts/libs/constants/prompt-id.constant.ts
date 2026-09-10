import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { PromptColumnName } from "../enums/enums.js";

const PROMPT_ID = `${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`;

export { PROMPT_ID };
