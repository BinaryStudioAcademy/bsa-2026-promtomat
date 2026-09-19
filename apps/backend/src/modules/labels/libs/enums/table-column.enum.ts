import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { PromptColumnName } from "~/modules/prompts/libs/enums/enums.js";

import { ColumnName } from "./column-name.enum.js";

const TableColumn = {
	LABEL_ID: `${DatabaseTableName.LABELS}.${ColumnName.ID}`,
	LABEL_NAME: `${DatabaseTableName.LABELS}.${ColumnName.NAME}`,
	LABEL_WORKSPACE_ID: `${DatabaseTableName.LABELS}.${ColumnName.WORKSPACE_ID}`,
	PROMPT_COUNT_ALIAS: "promptCount",
	PROMPT_ID: `${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`,
	PROMPT_LABEL_ID: `${DatabaseTableName.PROMPTS}.${PromptColumnName.LABEL_ID}`,
} as const;

export { TableColumn };
