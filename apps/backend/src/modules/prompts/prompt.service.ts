import { Database } from "~/libs/modules/database/database.js";
import { GeneratorInterface } from "~/libs/modules/generator/generator.js";

import { LabelService } from "../labels/labels.js";
import { type WorkspaceService } from "../workspaces/workspace.service.js";
import { createGenerateLabelMessage } from "./libs/helpers/helpers.js";
import {
	type PromptCreatePayload,
	type PromptDto,
} from "./libs/types/types.js";
import { PromptEntity } from "./prompt.entity.js";
import { type PromptRepository } from "./prompt.repository.js";

type Constructor = {
	database: Database;
	generator: GeneratorInterface;
	labelService: LabelService;
	promptRepository: PromptRepository;
	workspaceService: WorkspaceService;
};

class PromptService {
	private database: Database;

	private generator: GeneratorInterface;

	private labelService: LabelService;

	private promptRepository: PromptRepository;

	private workspaceService: WorkspaceService;

	public constructor({
		database,
		generator,
		labelService,
		promptRepository,
		workspaceService,
	}: Constructor) {
		this.promptRepository = promptRepository;
		this.workspaceService = workspaceService;
		this.labelService = labelService;
		this.generator = generator;
		this.database = database;
	}

	private async generateLabel(prompt: string, workspaceId: number) {
		const labels = await this.labelService.findAll(workspaceId);
		const generatedLabel = await this.generator.generateText({
			config: {
				maxTokens: 200,
				temperature: 0.5,
				topP: 1,
			},
			message: createGenerateLabelMessage(prompt, labels),
		});

		return generatedLabel;
	}

	public async create(payload: PromptCreatePayload): Promise<PromptDto> {
		const { efficiencyScore, promptBody, taskIntent, userId, workspaceId } =
			payload;

		await this.workspaceService.checkUserAccess(workspaceId, userId);

		const generatedLabel = await this.generateLabel(promptBody, workspaceId);

		return await this.database.transaction(async (trx) => {
			const label = await this.labelService.getOrCreate(
				{ name: generatedLabel, workspaceId },
				trx,
			);

			const prompt = await this.promptRepository.create(
				PromptEntity.initializeNew({
					efficiencyScore,
					labelId: label.id,
					promptBody,
					taskIntent,
					userId,
					workspaceId,
				}),
				trx,
			);

			return prompt.toObject();
		});
	}
}

export { PromptService };
