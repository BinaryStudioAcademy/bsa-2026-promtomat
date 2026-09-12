import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { LabelColumnName } from "../enums/enums.js";

const LABEL_NAME = `${DatabaseTableName.LABELS}.${LabelColumnName.NAME}`;

export { LABEL_NAME };
