import { type Transaction } from "objection";

import { type ValueOf } from "~/libs/types/types.js";

import { EvaluationEntity } from "./evaluation.entity.js";
import { type EvaluationModel } from "./evaluation.model.js";
import { EvaluationColumnName } from "./libs/enums/enums.js";
import {
	type EvaluationConflictColumn,
	type EvaluationInsertPayload,
	type EvaluationUpsertPayload,
} from "./libs/types/types.js";

class EvaluationRepository {
	private evaluationModel: typeof EvaluationModel;

	public constructor(evaluationModel: typeof EvaluationModel) {
		this.evaluationModel = evaluationModel;
	}

	private async findScoresBy(
		where: Partial<Record<ValueOf<typeof EvaluationColumnName>, number>>,
		trx?: Transaction,
	): Promise<number[]> {
		const rows = await this.evaluationModel
			.query(trx)
			.select(EvaluationColumnName.SCORE)
			.where(where)
			.execute();

		return rows.map((row) => row.score);
	}

	private initializeEntity(model: EvaluationModel): EvaluationEntity {
		return EvaluationEntity.initialize({
			composedPromptId: model.composedPromptId,
			createdAt: model.createdAt,
			id: model.id,
			promptId: model.promptId,
			score: model.score,
			updatedAt: model.updatedAt,
			userId: model.userId,
		});
	}

	private async upsertEvaluation({
		conflictColumn,
		insertPayload,
		trx,
	}: {
		conflictColumn: EvaluationConflictColumn;
		insertPayload: EvaluationInsertPayload;
		trx?: Transaction | undefined;
	}): Promise<EvaluationEntity> {
		const knex = this.evaluationModel.knex();

		const evaluation = await this.evaluationModel
			.query(trx)
			.insert(insertPayload)
			.onConflict(
				knex.raw("(??, ??) WHERE ?? IS NOT NULL", [
					EvaluationColumnName.USER_ID,
					conflictColumn,
					conflictColumn,
				]),
			)
			.merge({
				score: insertPayload.score,
				updatedAt: knex.fn.now(),
			})
			.returning("*")
			.execute();

		return this.initializeEntity(evaluation);
	}

	public async createOrUpdate(
		payload: EvaluationUpsertPayload,
		trx?: Transaction,
	): Promise<EvaluationEntity> {
		if (payload.promptId) {
			return await this.upsertEvaluation({
				conflictColumn: EvaluationColumnName.PROMPT_ID,
				insertPayload: {
					composedPromptId: null,
					promptId: payload.promptId,
					score: payload.score,
					userId: payload.userId,
				},
				trx,
			});
		}

		return await this.upsertEvaluation({
			conflictColumn: EvaluationColumnName.COMPOSED_PROMPT_ID,
			insertPayload: {
				composedPromptId: payload.composedPromptId as number,
				promptId: null,
				score: payload.score,
				userId: payload.userId,
			},
			trx,
		});
	}

	public async findScoresByComposedPromptId(
		composedPromptId: number,
		trx?: Transaction,
	): Promise<number[]> {
		return await this.findScoresBy(
			{ [EvaluationColumnName.COMPOSED_PROMPT_ID]: composedPromptId },
			trx,
		);
	}

	public async findScoresByPromptId(
		promptId: number,
		trx?: Transaction,
	): Promise<number[]> {
		return await this.findScoresBy(
			{ [EvaluationColumnName.PROMPT_ID]: promptId },
			trx,
		);
	}
}

export { EvaluationRepository };
