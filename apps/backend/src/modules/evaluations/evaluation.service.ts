import { type Database } from "~/libs/modules/database/database.js";
import { type ComposedPromptService } from "~/modules/composed-prompts/composed-prompt.service.js";
import { type PromptService } from "~/modules/prompts/prompt.service.js";

import { type EvaluationRepository } from "./evaluation.repository.js";
import { computeDampedMean } from "./libs/helpers/helpers.js";
import {
	type EvaluationResponseDto,
	type EvaluationUpsertPayload,
} from "./libs/types/types.js";

type Constructor = {
	composedPromptService: ComposedPromptService;
	database: Database;
	evaluationRepository: EvaluationRepository;
	promptService: PromptService;
};

class EvaluationService {
	private composedPromptService: ComposedPromptService;

	private database: Database;

	private evaluationRepository: EvaluationRepository;

	private promptService: PromptService;

	public constructor({
		composedPromptService,
		database,
		evaluationRepository,
		promptService,
	}: Constructor) {
		this.composedPromptService = composedPromptService;
		this.database = database;
		this.evaluationRepository = evaluationRepository;
		this.promptService = promptService;
	}

	public async create(
		payload: EvaluationUpsertPayload,
	): Promise<EvaluationResponseDto> {
		return await this.database.transaction(async (trx) => {
			if (payload.promptId) {
				const prompt = await this.promptService.findByIdForUpdate(
					payload.promptId,
					trx,
				);

				await this.evaluationRepository.createOrUpdate(payload, trx);

				const scores = await this.evaluationRepository.findScoresByPromptId(
					payload.promptId,
					trx,
				);

				const computedScore = computeDampedMean({
					evaluationScores: scores,
					priorScore: prompt ? prompt.toObject().efficiencyScore : null,
				});

				await this.promptService.updateComputedScore(
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

			await this.composedPromptService.findByIdForUpdate(targetId, trx);
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

			await this.composedPromptService.updateComputedScore(
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
