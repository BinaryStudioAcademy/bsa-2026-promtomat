import { type EvaluationCreateRequestDto } from "~/libs/types/types.js";

type EvaluationUpsertPayload = EvaluationCreateRequestDto & {
	userId: number;
};

export { type EvaluationUpsertOptions } from "./evaluation-upsert-options.type.js";
export {
	type EvaluationCreateRequestDto,
	type EvaluationResponseDto,
} from "~/libs/types/types.js";
export { type EvaluationUpsertPayload };
