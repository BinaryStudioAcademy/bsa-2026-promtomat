import { type Transaction, UniqueViolationError } from "objection";

import { SortOrder } from "~/libs/enums/enums.js";
import { DatabaseTableName } from "~/libs/modules/database/libs/enums/enums.js";

import { ContributorColumnName } from "../contributors/libs/enums/enums.js";
import { PaginationValue } from "../prompts/libs/enums/enums.js";
import { WorkspaceColumnName } from "../workspaces/libs/enums/enums.js";
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
			computedScore: composedPrompt.computedScore,
			createdAt: composedPrompt.createdAt,
			description: composedPrompt.description,
			descriptionHash: composedPrompt.descriptionHash,
			explanation: composedPrompt.explanation,
			id: composedPrompt.id,
			modelId: composedPrompt.modelId,
			requesterId: composedPrompt.requesterId,
			sources: composedPrompt.sources.map((source) => ({
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

	public async findAll({
		limit = PaginationValue.DEFAULT_LIMIT,
		page = PaginationValue.DEFAULT_PAGE,
		userId,
		workspaceId,
	}: {
		limit?: number | undefined;
		page?: number | undefined;
		userId: number;
		workspaceId: number;
	}): Promise<{ items: ComposedPromptEntity[]; totalCount: number }> {
		const offset = (page - PaginationValue.DEFAULT_PAGE) * limit;

		const baseQuery = this.composedPromptModel
			.query()
			.where({ workspaceId })
			.where((builder) => {
				builder
					.whereExists(
						this.composedPromptModel
							.query()
							.select(
								`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`,
							)
							.from(DatabaseTableName.WORKSPACES)
							.whereColumn(
								`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`,
								`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.WORKSPACE_ID}`,
							)
							.where(
								`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.USER_ID}`,
								userId,
							),
					)
					.orWhereExists(
						this.composedPromptModel
							.query()
							.select(
								`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.ID}`,
							)
							.from(DatabaseTableName.CONTRIBUTORS)
							.whereColumn(
								`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.WORKSPACE_ID}`,
								`${DatabaseTableName.COMPOSED_PROMPTS}.${ComposedPromptColumnName.WORKSPACE_ID}`,
							)
							.where(
								`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.USER_ID}`,
								userId,
							),
					);
			});

		const totalCount = await baseQuery.resultSize();
		const items = await baseQuery
			.clone()
			.withGraphFetched(SOURCES_GRAPH)
			.orderBy(ComposedPromptColumnName.CREATED_AT, SortOrder.DESC)
			.offset(offset)
			.limit(limit)
			.execute();

		return {
			items: items.map((item) => this.initializeEntity(item)),
			totalCount,
		};
	}

	public async findById(id: number): Promise<ComposedPromptEntity | null> {
		const composedPrompt = await this.composedPromptModel
			.query()
			.findById(id)
			.withGraphFetched(SOURCES_GRAPH)
			.execute();

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
