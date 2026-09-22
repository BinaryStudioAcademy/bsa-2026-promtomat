import { type Transaction } from "objection";

import { EvaluationEntity } from "./evaluation.entity.js";
import { type EvaluationModel } from "./evaluation.model.js";
import { EvaluationColumnName } from "./libs/enums/enums.js";
import { type EvaluationUpsertPayload } from "./libs/types/types.js";

class EvaluationRepository {
	private evaluationModel: typeof EvaluationModel;

	public constructor(evaluationModel: typeof EvaluationModel) {
		this.evaluationModel = evaluationModel;
	}

	public async createOrUpdate(
		{ composedPromptId, promptId, score, userId }: EvaluationUpsertPayload,
		trx: Transaction,
	): Promise<EvaluationEntity> {
		const knex = this.evaluationModel.knex();

		if (promptId) {
			const evaluation = await this.evaluationModel
				.query(trx)
				.insert({
					composedPromptId: null,
					promptId,
					score,
					userId,
				})
				.onConflict(
					knex.raw(
						`(${EvaluationColumnName.USER_ID}, ${EvaluationColumnName.PROMPT_ID}) WHERE ${EvaluationColumnName.PROMPT_ID} IS NOT NULL`,
					),
				)
				.merge({
					score,
					updatedAt: knex.fn.now(),
				})
				.returning("*");

			return EvaluationEntity.initialize(evaluation);
		}

		const evaluation = await this.evaluationModel
			.query(trx)
			.insert({
				composedPromptId: composedPromptId as number,
				promptId: null,
				score,
				userId,
			})
			.onConflict(
				knex.raw(
					`(${EvaluationColumnName.USER_ID}, ${EvaluationColumnName.COMPOSED_PROMPT_ID}) WHERE ${EvaluationColumnName.COMPOSED_PROMPT_ID} IS NOT NULL`,
				),
			)
			.merge({
				score,
				updatedAt: knex.fn.now(),
			})
			.returning("*");

		return EvaluationEntity.initialize(evaluation);
	}

	public async findScoresByComposedPromptId(
		composedPromptId: number,
		trx?: Transaction,
	): Promise<number[]> {
		const rows = await this.evaluationModel
			.query(trx)
			.select(EvaluationColumnName.SCORE)
			.where({
				[EvaluationColumnName.COMPOSED_PROMPT_ID]: composedPromptId,
			})
			.execute();

		return rows.map((row) => row.score);
	}

	public async findScoresByPromptId(
		promptId: number,
		trx?: Transaction,
	): Promise<number[]> {
		const rows = await this.evaluationModel
			.query(trx)
			.select(EvaluationColumnName.SCORE)
			.where({ [EvaluationColumnName.PROMPT_ID]: promptId })
			.execute();

		return rows.map((row) => row.score);
	}
}

export { EvaluationRepository };
