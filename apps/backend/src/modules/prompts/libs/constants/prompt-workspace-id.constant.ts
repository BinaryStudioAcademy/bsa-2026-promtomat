import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { PromptColumnName } from "../enums/enums.js";

const PROMPT_WORKSPACE_ID = `${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`;

export { PROMPT_WORKSPACE_ID };
