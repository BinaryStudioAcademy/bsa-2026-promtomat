import { type Transaction } from "objection";

import { type EvaluationConflictColumn } from "./evaluation-conflict-column.type.js";
import { type EvaluationInsertPayload } from "./evaluation-insert-payload.type.js";

type EvaluationUpsertOptions = {
	conflictColumn: EvaluationConflictColumn;
	insertPayload: EvaluationInsertPayload;
	trx?: Transaction | undefined;
};

export { type EvaluationUpsertOptions };
