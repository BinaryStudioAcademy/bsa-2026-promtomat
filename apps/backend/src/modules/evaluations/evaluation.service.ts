import { type Database } from "~/libs/modules/database/database.js";
import { type ComposedPromptRepository } from "~/modules/composed-prompts/composed-prompt.repository.js";
import { type PromptRepository } from "~/modules/prompts/prompt.repository.js";

import { type EvaluationRepository } from "./evaluation.repository.js";
import { computeDampedMean } from "./libs/helpers/helpers.js";
import {
	type EvaluationResponseDto,
	type EvaluationUpsertPayload,
} from "./libs/types/types.js";

type Constructor = {
	composedPromptRepository: ComposedPromptRepository;
	database: Database;
	evaluationRepository: EvaluationRepository;
	promptRepository: PromptRepository;
};

class EvaluationService {
	private composedPromptRepository: ComposedPromptRepository;

	private database: Database;

	private evaluationRepository: EvaluationRepository;

	private promptRepository: PromptRepository;

	public constructor({
		composedPromptRepository,
		database,
		evaluationRepository,
		promptRepository,
	}: Constructor) {
		this.composedPromptRepository = composedPromptRepository;
		this.database = database;
		this.evaluationRepository = evaluationRepository;
		this.promptRepository = promptRepository;
	}

	public async create(
		payload: EvaluationUpsertPayload,
	): Promise<EvaluationResponseDto> {
		return await this.database.transaction(async (trx) => {
			if (payload.promptId) {
				const prompt = await this.promptRepository.findByIdForUpdate(
					payload.promptId,
					trx,
				);

				await this.evaluationRepository.createOrUpdate(payload, trx);

				const scores = await this.evaluationRepository.findScoresByPromptId(
					payload.promptId,
					trx,
				);

				const promptDto = await this.promptRepository.findById(
					payload.promptId,
				);
				const computedScore = computeDampedMean({
					evaluationScores: scores,
					priorScore:
						prompt?.toObject().efficiencyScore ?? promptDto?.score ?? null,
				});

				await this.promptRepository.updateComputedScore(
					payload.promptId,
					computedScore,
					trx,
				);

				return {
					computedScore,
					score: payload.score,
					targetId: payload.promptId,
					targetType: "prompt",
				};
			}

			const targetId = payload.composedPromptId as number;

			await this.composedPromptRepository.findByIdForUpdate(targetId, trx);
			await this.evaluationRepository.createOrUpdate(payload, trx);

			const scores =
				await this.evaluationRepository.findScoresByComposedPromptId(
					targetId,
					trx,
				);

			const computedScore = computeDampedMean({
				evaluationScores: scores,
				priorScore: null,
			});

			await this.composedPromptRepository.updateComputedScore(
				targetId,
				computedScore,
				trx,
			);

			return {
				computedScore,
				score: payload.score,
				targetId,
				targetType: "composed-prompt",
			};
		});
	}
}

export { EvaluationService };
