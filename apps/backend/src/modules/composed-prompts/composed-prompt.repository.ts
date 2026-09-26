import { UniqueViolationError } from "objection";

import { ComposedPromptEntity } from "./composed-prompt.entity.js";
import { type ComposedPromptModel } from "./composed-prompt.model.js";
import { SOURCES_GRAPH } from "./libs/constants/constants.js";
import { ComposedPromptColumnName } from "./libs/enums/enums.js";
import { ComposedPromptDuplicateError } from "./libs/exceptions/exceptions.js";

class ComposedPromptRepository {
	private composedPromptModel: typeof ComposedPromptModel;

	public constructor(composedPromptModel: typeof ComposedPromptModel) {
		this.composedPromptModel = composedPromptModel;
	}

	private initializeEntity(
		composedPrompt: ComposedPromptModel,
	): ComposedPromptEntity {
		return ComposedPromptEntity.initialize({
			body: composedPrompt.body,
			createdAt: composedPrompt.createdAt,
			description: composedPrompt.description,
			descriptionHash: composedPrompt.descriptionHash,
			explanation: composedPrompt.explanation,
			id: composedPrompt.id,
			modelId: composedPrompt.modelId,
			requesterId: composedPrompt.requesterId,
			sources: composedPrompt.sources.map((source) => ({
				efficiencyScore: source.prompt.efficiencyScore,
				promptId: source.promptId,
				rank: source.rank,
				taskIntent: source.prompt.taskIntent,
			})),
			updatedAt: composedPrompt.updatedAt,
			workspaceId: composedPrompt.workspaceId,
		});
	}

	public async create(
		entity: ComposedPromptEntity,
	): Promise<ComposedPromptEntity> {
		try {
			return await this.composedPromptModel.transaction(async (trx) => {
				const inserted = await this.composedPromptModel
					.query(trx)
					.insertGraph(entity.toNewObject())
					.execute();
				const composedPrompt = await inserted.$fetchGraph(SOURCES_GRAPH, {
					transaction: trx,
				});

				return this.initializeEntity(composedPrompt);
			});
		} catch (error) {
			if (error instanceof UniqueViolationError) {
				throw new ComposedPromptDuplicateError(error);
			}

			throw error;
		}
	}

	public async findById(id: number): Promise<ComposedPromptEntity | null> {
		const composedPrompt = await this.composedPromptModel
			.query()
			.findById(id)
			.withGraphFetched(SOURCES_GRAPH)
			.execute();

		return composedPrompt ? this.initializeEntity(composedPrompt) : null;
	}

	public async findByWorkspaceAndHash(
		workspaceId: number,
		descriptionHash: string,
	): Promise<ComposedPromptEntity | null> {
		const composedPrompt = await this.composedPromptModel
			.query()
			.findOne({ descriptionHash, workspaceId })
			.withGraphFetched(SOURCES_GRAPH)
			.execute();

		return composedPrompt ? this.initializeEntity(composedPrompt) : null;
	}

	public async findWorkspaceId(id: number): Promise<null | number> {
		const composedPrompt = await this.composedPromptModel
			.query()
			.findById(id)
			.select(ComposedPromptColumnName.WORKSPACE_ID)
			.execute();

		return composedPrompt?.workspaceId ?? null;
	}
}

export { ComposedPromptRepository };
