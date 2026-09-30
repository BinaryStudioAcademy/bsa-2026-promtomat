import { type Transaction } from "objection";

import {
	ComposedPromptError,
	PromptError,
} from "~/libs/exceptions/exceptions.js";
import { type Database } from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";
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

type TargetHandler = {
	findScores: (targetId: number, trx: Transaction) => Promise<number[]>;
	getPriorScore: (targetId: number, trx: Transaction) => Promise<null | number>;
	updateComputedScore: (
		targetId: number,
		computedScore: null | number,
		trx: Transaction,
	) => Promise<void>;
};

class EvaluationService {
	private composedPromptService: ComposedPromptService;

	private database: Database;

	private evaluationRepository: EvaluationRepository;

	private promptService: PromptService;

	private targetHandlers: Record<
		ValueOf<typeof EvaluationTargetType>,
		TargetHandler
	>;

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

		this.targetHandlers = {
			[EvaluationTargetType.COMPOSED_PROMPT]: {
				findScores: (targetId, trx) =>
					this.evaluationRepository.findScoresByComposedPromptId(targetId, trx),
				getPriorScore: (targetId, trx) =>
					this.getComposedPromptPriorScore(targetId, trx),
				updateComputedScore: (targetId, computedScore, trx) =>
					this.composedPromptService.updateComputedScore(
						targetId,
						computedScore,
						trx,
					),
			},
			[EvaluationTargetType.PROMPT]: {
				findScores: (targetId, trx) =>
					this.evaluationRepository.findScoresByPromptId(targetId, trx),
				getPriorScore: (targetId, trx) =>
					this.getPromptPriorScore(targetId, trx),
				updateComputedScore: (targetId, computedScore, trx) =>
					this.promptService.updateComputedScore(targetId, computedScore, trx),
			},
		};
	}

	private async getComposedPromptPriorScore(
		targetId: number,
		trx: Transaction,
	): Promise<null> {
		const composedPrompt = await this.composedPromptService.findByIdForUpdate(
			targetId,
			trx,
		);

		if (!composedPrompt) {
			throw ComposedPromptError.notFound();
		}

		return null;
	}

	private async getPromptPriorScore(
		targetId: number,
		trx: Transaction,
	): Promise<null | number> {
		const prompt = await this.promptService.findByIdForUpdate(targetId, trx);

		if (!prompt) {
			throw PromptError.notFound();
		}

		return prompt.toObject().efficiencyScore;
	}

	public async upsert(
		payload: EvaluationUpsertPayload,
	): Promise<EvaluationResponseDto> {
		const { score, targetId, targetType } = payload;
		const handler = this.targetHandlers[targetType];

		return await this.database.transaction(async (trx) => {
			const priorScore = await handler.getPriorScore(targetId, trx);

			await this.evaluationRepository.createOrUpdate(payload, trx);

			const scores = await handler.findScores(targetId, trx);

			const computedScore = computeDampedMean({
				evaluationScores: scores,
				priorScore,
			});

			await handler.updateComputedScore(targetId, computedScore, trx);

			return {
				computedScore,
				score,
				targetId,
				targetType,
			};
		});
	}
}

export { EvaluationService };
