import { type EvaluationCreateRequestDto } from "~/libs/types/types.js";

type EvaluationUpsertPayload = EvaluationCreateRequestDto & {
	userId: number;
};

export { type EvaluationConflictColumn } from "./evaluation-conflict-column.type.js";
export { type EvaluationInsertPayload } from "./evaluation-insert-payload.type.js";
export {
	type EvaluationCreateRequestDto,
	type EvaluationResponseDto,
} from "~/libs/types/types.js";
export { type EvaluationUpsertPayload };
