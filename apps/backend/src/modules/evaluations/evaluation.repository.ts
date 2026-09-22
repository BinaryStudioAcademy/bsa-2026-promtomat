import { type Transaction } from "objection";

import { EvaluationEntity } from "./evaluation.entity.js";
import { type EvaluationModel } from "./evaluation.model.js";
import { EvaluationColumnName } from "./libs/enums/enums.js";
import { type EvaluationUpsertPayload } from "./libs/types/types.js";

type EvaluationDatabaseRow = {
	composed_prompt_id: null | number;
	created_at: string;
	id: number;
	prompt_id: null | number;
	score: number;
	updated_at: string;
	user_id: number;
};

type RawQueryResult = {
	rows: EvaluationDatabaseRow[];
};

class EvaluationRepository {
	private evaluationModel: typeof EvaluationModel;

	public constructor(evaluationModel: typeof EvaluationModel) {
		this.evaluationModel = evaluationModel;
	}

	private initializeEntity(row: EvaluationDatabaseRow): EvaluationEntity {
		return EvaluationEntity.initialize({
			composedPromptId: row.composed_prompt_id,
			createdAt: row.created_at,
			id: row.id,
			promptId: row.prompt_id,
			score: row.score,
			updatedAt: row.updated_at,
			userId: row.user_id,
		});
	}

	public async createOrUpdate(
		{ composedPromptId, promptId, score, userId }: EvaluationUpsertPayload,
		trx: Transaction,
	): Promise<EvaluationEntity> {
		const knex = this.evaluationModel.knex();

		if (promptId) {
			const result = (await knex
				.raw(
					`INSERT INTO evaluations (user_id, prompt_id, score, created_at, updated_at)
					VALUES (?, ?, ?, NOW(), NOW())
					ON CONFLICT (user_id, prompt_id) WHERE prompt_id IS NOT NULL
					DO UPDATE SET score = EXCLUDED.score, updated_at = NOW()
					RETURNING *`,
					[userId, promptId, score],
				)
				.transacting(trx)) as RawQueryResult;

			const [row] = result.rows;

			return this.initializeEntity(row as EvaluationDatabaseRow);
		}

		const result = (await knex
			.raw(
				`INSERT INTO evaluations (user_id, composed_prompt_id, score, created_at, updated_at)
				VALUES (?, ?, ?, NOW(), NOW())
				ON CONFLICT (user_id, composed_prompt_id) WHERE composed_prompt_id IS NOT NULL
				DO UPDATE SET score = EXCLUDED.score, updated_at = NOW()
				RETURNING *`,
				[userId, composedPromptId as number, score],
			)
			.transacting(trx)) as RawQueryResult;

		const [row] = result.rows;

		return this.initializeEntity(row as EvaluationDatabaseRow);
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
