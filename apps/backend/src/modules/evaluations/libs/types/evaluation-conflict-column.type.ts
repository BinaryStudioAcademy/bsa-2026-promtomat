import { type EvaluationColumnName } from "../enums/enums.js";

type EvaluationConflictColumn =
	| typeof EvaluationColumnName.COMPOSED_PROMPT_ID
	| typeof EvaluationColumnName.PROMPT_ID;

export { type EvaluationConflictColumn };
