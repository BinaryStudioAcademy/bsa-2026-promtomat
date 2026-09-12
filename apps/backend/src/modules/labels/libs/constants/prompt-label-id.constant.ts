import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { PromptColumnName } from "~/modules/prompts/libs/enums/enums.js";

const PROMPT_LABEL_ID = `${DatabaseTableName.PROMPTS}.${PromptColumnName.LABEL_ID}`;

export { PROMPT_LABEL_ID };
