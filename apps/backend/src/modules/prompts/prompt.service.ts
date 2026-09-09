import { WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { computeRelevance } from "~/modules/prompt-embeddings/libs/helpers/helpers.js";
import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import {
	type PromptCandidate,
	type PromptCandidateQuery,
	type PromptCreatePayload,
	type PromptDto,
} from "./libs/types/types.js";
import { PromptEntity } from "./prompt.entity.js";
import { type PromptRepository } from "./prompt.repository.js";

class PromptService {
	private promptEmbeddingService: PromptEmbeddingService;

	private promptRepository: PromptRepository;

	private workspaceService: WorkspaceService;

	public constructor(
		promptRepository: PromptRepository,
		promptEmbeddingService: PromptEmbeddingService,
		workspaceService: WorkspaceService,
	) {
		this.workspaceService = workspaceService;
		this.promptRepository = promptRepository;
		this.promptEmbeddingService = promptEmbeddingService;
	}

	public async create(payload: PromptCreatePayload): Promise<PromptDto> {
		const { efficiencyScore, promptBody, taskIntent, userId, workspaceId } =
			payload;

		const prompt = await this.promptRepository.create(
			PromptEntity.initializeNew({
				efficiencyScore,
				promptBody,
				taskIntent,
				userId,
				workspaceId,
			}),
		);

		const promptDto = prompt.toObject();

		void this.promptEmbeddingService.embedForPrompt(promptDto);

		return promptDto;
	}

	public async findCandidates({
		description,
		limit,
		userId,
		workspaceId,
	}: PromptCandidateQuery): Promise<PromptCandidate[]> {
		const workspace = await this.workspaceService.findByIdAndOwner(
			workspaceId,
			userId,
		);

		if (!workspace) {
			throw WorkspaceError.notFound();
		}

		const nearestPrompts = await this.promptEmbeddingService.findNearestByQuery(
			description,
			limit,
			workspaceId,
		);

		return nearestPrompts.map((nearestPromot) => {
			const relevance = computeRelevance({
				distance: nearestPromot.distance,
				efficiencyScore: nearestPromot.efficiencyScore,
			});
			return {
				...nearestPromot,
				relevance,
			};
		});
	}
}

export { PromptService };
