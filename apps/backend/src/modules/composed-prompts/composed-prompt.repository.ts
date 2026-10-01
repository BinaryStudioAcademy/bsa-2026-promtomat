import { raw, type Transaction } from "objection";

import { SortOrder, SQLAlias } from "~/libs/enums/enums.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { EvaluationColumnName } from "~/modules/evaluations/libs/enums/enums.js";

import { ComposedPromptEntity } from "./composed-prompt.entity.js";
import { type ComposedPromptModel } from "./composed-prompt.model.js";
import {
	LATEST_COMPOSITION_LIMIT,
	MY_SCORE_LOOKUP_LIMIT,
	SOURCES_GRAPH,
} from "./libs/constants/constants.js";
import { ComposedPromptColumnName } from "./libs/enums/enums.js";

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
			computedScore: composedPrompt.computedScore,
			createdAt: composedPrompt.createdAt,
			description: composedPrompt.description,
			descriptionHash: composedPrompt.descriptionHash,
			explanation: composedPrompt.explanation,
			id: composedPrompt.id,
			modelId: composedPrompt.modelId,
			myScore: composedPrompt.myScore ?? null,
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
	}

	public async findById(
		id: number,
		userId?: number,
	): Promise<ComposedPromptEntity | null> {
		const query = this.composedPromptModel
			.query()
			.findById(id)
			.withGraphFetched(SOURCES_GRAPH);

		if (userId !== undefined) {
			query.select(
				`${DatabaseTableName.COMPOSED_PROMPTS}.*`,
				raw("(SELECT ?? FROM ?? WHERE ?? = ?? AND ?? = ? LIMIT ?) as ??", [
					EvaluationColumnName.SCORE,
					DatabaseTableName.EVALUATIONS,
					`${DatabaseTableName.EVALUATIONS}.${EvaluationColumnName.COMPOSED_PROMPT_ID}`,
					`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.ID}`,
					`${DatabaseTableName.EVALUATIONS}.${EvaluationColumnName.USER_ID}`,
					userId,
					MY_SCORE_LOOKUP_LIMIT,
					SQLAlias.MY_SCORE,
				]),
			);
		}

		const composedPrompt = await query.execute();

		return composedPrompt ? this.initializeEntity(composedPrompt) : null;
	}

	public async findByIdForUpdate(
		id: number,
		trx: Transaction,
	): Promise<null | { id: number }> {
		const model = await this.composedPromptModel
			.query(trx)
			.select("id")
			.findById(id)
			.forUpdate()
			.castTo<undefined | { id: number }>();

		return model ?? null;
	}

	public async findCountByWorkspaceAndHash(
		workspaceId: number,
		descriptionHash: string,
	): Promise<number> {
		return await this.composedPromptModel
			.query()
			.where({ descriptionHash, workspaceId })
			.resultSize();
	}

	public async findLatestByWorkspaceAndHash(
		workspaceId: number,
		descriptionHash: string,
	): Promise<ComposedPromptEntity | null> {
		const composedPrompt = await this.composedPromptModel
			.query()
			.findOne({ descriptionHash, workspaceId })
			.orderBy(ComposedPromptColumnName.CREATED_AT, SortOrder.DESC)
			.orderBy(ComposedPromptColumnName.ID, SortOrder.DESC)
			.limit(LATEST_COMPOSITION_LIMIT)
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

	public async updateComputedScore(
		id: number,
		computedScore: null | number,
		trx?: Transaction,
	): Promise<void> {
		await this.composedPromptModel
			.query(trx)
			.findById(id)
			.patch({ computedScore });
	}
}

export { ComposedPromptRepository };
