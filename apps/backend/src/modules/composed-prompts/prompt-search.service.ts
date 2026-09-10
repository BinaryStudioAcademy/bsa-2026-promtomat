// Temporary retrieval adapter. Delete this file, `DISTANCE_THRESHOLD` and the
// `PromptCandidate` / `PromptSearchService` types in `libs/types`.
import { ApplicationError } from "~/libs/exceptions/exceptions.js";
import { type EmbeddingService } from "~/libs/modules/embedding/embedding.js";
import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";
import { type PromptService } from "~/modules/prompts/prompt.service.js";

import {
	DISTANCE_THRESHOLD,
	MAXIMUM_RELEVANCE,
} from "./libs/constants/constants.js";
import { PromptSearchErrorMessage } from "./libs/enums/enums.js";
import {
	type FindCandidatesQuery,
	type PromptCandidate,
	type PromptSearchService,
} from "./libs/types/types.js";

type Constructor = {
	embeddingService: EmbeddingService;
	promptEmbeddingService: PromptEmbeddingService;
	promptService: PromptService;
};

class TemporaryPromptSearchService implements PromptSearchService {
	private embeddingService: EmbeddingService;

	private promptEmbeddingService: PromptEmbeddingService;

	private promptService: PromptService;

	public constructor({
		embeddingService,
		promptEmbeddingService,
		promptService,
	}: Constructor) {
		this.embeddingService = embeddingService;
		this.promptEmbeddingService = promptEmbeddingService;
		this.promptService = promptService;
	}

	public async findCandidates(
		query: FindCandidatesQuery,
	): Promise<PromptCandidate[]> {
		const [embedding] = await this.embeddingService.embed([query.description]);

		if (!embedding) {
			throw new ApplicationError({
				message: PromptSearchErrorMessage.EMBEDDING_MISSING,
			});
		}

		const nearest = await this.promptEmbeddingService.findNearest({
			embedding,
			limit: query.limit,
			workspaceId: query.workspaceId,
		});
		const closeEnough = nearest.filter(
			({ distance }) => distance <= DISTANCE_THRESHOLD,
		);

		const [closest] = closeEnough;

		if (!closest) {
			return [];
		}

		const prompts = await this.promptService.findAllByIds(
			closeEnough.map(({ promptId }) => promptId),
		);
		const promptsById = new Map(prompts.map((prompt) => [prompt.id, prompt]));

		return closeEnough.flatMap(({ distance, promptId }) => {
			const prompt = promptsById.get(promptId);

			if (!prompt) {
				return [];
			}

			return [
				{
					distance,
					efficiencyScore: prompt.efficiencyScore,
					promptBody: prompt.promptBody,
					promptId,
					relevance: MAXIMUM_RELEVANCE - distance,
					taskIntent: prompt.taskIntent,
				},
			];
		});
	}
}

export { TemporaryPromptSearchService };
