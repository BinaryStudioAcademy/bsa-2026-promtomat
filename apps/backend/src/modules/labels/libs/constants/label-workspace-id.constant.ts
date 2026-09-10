import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { LabelColumnName } from "../enums/enums.js";

const LABEL_WORKSPACE_ID = `${DatabaseTableName.LABELS}.${LabelColumnName.WORKSPACE_ID}`;

export { LABEL_WORKSPACE_ID };
