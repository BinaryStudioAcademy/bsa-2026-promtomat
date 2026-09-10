import { type PromptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embedding.service.js";

import {
	type PromptCreatePayload,
	type PromptDto,
} from "./libs/types/types.js";
import { PromptEntity } from "./prompt.entity.js";
import { type PromptRepository } from "./prompt.repository.js";

class PromptService {
	private promptEmbeddingService: PromptEmbeddingService;

	private promptRepository: PromptRepository;

	public constructor(
		promptRepository: PromptRepository,
		promptEmbeddingService: PromptEmbeddingService,
	) {
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

	public async findAllByIds(ids: number[]): Promise<PromptDto[]> {
		const prompts = await this.promptRepository.findAllByIds(ids);

		return prompts.map((prompt) => prompt.toObject());
	}
}

export { PromptService };
