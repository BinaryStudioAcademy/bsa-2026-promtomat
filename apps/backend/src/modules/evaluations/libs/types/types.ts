import { type EvaluationCreateRequestDto } from "@promptomat/shared";

type EvaluationUpsertPayload = EvaluationCreateRequestDto & {
	userId: number;
};

export {
	type EvaluationCreateRequestDto,
	type EvaluationResponseDto,
} from "@promptomat/shared";
export { type EvaluationUpsertPayload };
