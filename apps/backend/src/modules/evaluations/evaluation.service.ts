import { ErrorCode } from "~/libs/enums/enums.js";
import { type Database } from "~/libs/modules/database/database.js";
import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type ComposedPromptService } from "~/modules/composed-prompts/composed-prompt.service.js";
import { type PromptService } from "~/modules/prompts/prompt.service.js";

import { type EvaluationRepository } from "./evaluation.repository.js";
import { EvaluationTargetType } from "./libs/enums/enums.js";
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

				if (!prompt) {
					throw new HTTPError({
						code: ErrorCode.NOT_FOUND,
						message: "Prompt not found",
						status: HTTPCode.NOT_FOUND,
					});
				}

				await this.evaluationRepository.createOrUpdate(payload, trx);

				const scores = await this.evaluationRepository.findScoresByPromptId(
					payload.promptId,
					trx,
				);

				const computedScore = computeDampedMean({
					evaluationScores: scores,
					priorScore: prompt.toObject().efficiencyScore,
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
					targetType: EvaluationTargetType.PROMPT,
				};
			}

			const targetId = payload.composedPromptId as number;

			const composedPrompt = await this.composedPromptService.findByIdForUpdate(
				targetId,
				trx,
			);

			if (!composedPrompt) {
				throw new HTTPError({
					code: ErrorCode.NOT_FOUND,
					message: "Composed prompt not found",
					status: HTTPCode.NOT_FOUND,
				});
			}

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
				targetType: EvaluationTargetType.COMPOSED_PROMPT,
			};
		});
	}
}

export { EvaluationService };
