import { raw, type Transaction } from "objection";

import {
	QUALITY_SCORE_THRESHOLD,
	ZERO_VALUE,
} from "~/libs/constants/constants.js";
import {
	PromptQualityTier,
	QueryClearTarget,
	SortOrder,
	SQLAlias,
} from "~/libs/enums/enums.js";
import { escapeILikePattern } from "~/libs/helpers/helpers.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { LabelColumnName } from "~/modules/labels/libs/enums/enums.js";
import {
	FIRST_PAGE,
	LABEL_ALIAS,
	LABEL_ID,
	PROMPT_ID,
	PROMPT_LABEL_ID,
	PROMPT_WORKSPACE_ID,
	WORKSPACE_RELATION,
} from "~/modules/prompts/libs/constants/constants.js";
import {
	PaginationValue,
	PromptColumnName,
} from "~/modules/prompts/libs/enums/enums.js";
import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";
import { WorkspaceColumnName } from "~/modules/workspaces/libs/enums/enums.js";

import {
	type PromptAggregateResult,
	type PromptDto,
	type PromptFilterByQueryParameters,
	type PromptFindAllOptions,
	type PromptFindByWorkspacePayload,
	type PromptItemResponseDto,
	type PromptRecentDto,
	type PromptRepositoryFindAllResponseDto,
	type PromptRepositoryItem,
	type PromptUpdatePayload,
} from "./libs/types/types.js";

class PromptRepository {
	private promptModel: typeof PromptModel;

	public constructor(promptModel: typeof PromptModel) {
		this.promptModel = promptModel;
	}

	private applyFilters(
		query: ReturnType<typeof this.promptModel.query>,
		{ search, userId, workspaceId }: PromptFilterByQueryParameters,
	): ReturnType<typeof this.promptModel.query> {
		query.where(
			`${DatabaseTableName.PROMPTS}.${PromptColumnName.USER_ID}`,
			userId,
		);

		if (workspaceId) {
			query.where(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
				workspaceId,
			);
		}

		if (search) {
			const escapedSearch = escapeILikePattern(search);

			query.where((subQuery) => {
				subQuery
					.whereILike(
						`${DatabaseTableName.PROMPTS}.${PromptColumnName.TASK_INTENT}`,
						`%${escapedSearch}%`,
					)
					.orWhereILike(
						`${DatabaseTableName.PROMPTS}.${PromptColumnName.PROMPT_BODY}`,
						`%${escapedSearch}%`,
					);
			});
		}

		return query;
	}

	private async findAggregate(
		baseQuery: ReturnType<typeof this.promptModel.query>,
	): Promise<PromptAggregateResult> {
		const [aggregation] = await baseQuery
			.clone()
			.clearSelect()
			.clearOrder()
			.clear(QueryClearTarget.LIMIT)
			.clear(QueryClearTarget.OFFSET)
			.count(`${DatabaseTableName.PROMPTS}.${PromptColumnName.ID} as count`)
			.select(
				raw("AVG(COALESCE(??, ??)) as ??", [
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
					`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE}`,
					"averageScore",
				]),
			)
			.castTo<{ averageScore: null | string; count: string }[]>()
			.execute();

		return {
			averageScore: aggregation?.averageScore
				? Number(aggregation.averageScore)
				: null,
			totalCount: aggregation?.count ? Number(aggregation.count) : ZERO_VALUE,
		};
	}

	private initializeEntity(model: PromptModel): PromptEntity {
		return PromptEntity.initialize({
			computedScore: model.computedScore,
			createdAt: model.createdAt,
			efficiencyScore: model.efficiencyScore,
			id: model.id,
			labelId: model.labelId as number,
			promptBody: model.promptBody,
			taskIntent: model.taskIntent,
			updatedAt: model.updatedAt,
			userId: model.userId,
			workspaceId: model.workspaceId,
		});
	}

	public async create(
		entity: PromptEntity,
		trx?: Transaction,
	): Promise<PromptEntity> {
		const prompt = await this.promptModel
			.query(trx)
			.insert(entity.toNewObject())
			.returning("*")
			.execute();

		return this.initializeEntity(prompt);
	}

	public async findAll({
		query,
		userId,
	}: PromptFindAllOptions): Promise<PromptRepositoryFindAllResponseDto> {
		const {
			limit = PaginationValue.DEFAULT_LIMIT,
			page = PaginationValue.DEFAULT_PAGE,
			qualityTier,
			search,
			workspaceId,
		} = query;

		const baseQuery = this.promptModel.query();
		this.applyFilters(baseQuery, {
			search: search ?? undefined,
			userId,
			workspaceId: workspaceId ?? undefined,
		});

		if (qualityTier && qualityTier !== PromptQualityTier.ALL) {
			switch (qualityTier) {
				case PromptQualityTier.NEEDS_IMPROVEMENT: {
					baseQuery
						.where(
							`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
							">=",
							QUALITY_SCORE_THRESHOLD.MIN_NEEDS_IMPROVEMENT,
						)
						.andWhere(
							`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
							"<",
							QUALITY_SCORE_THRESHOLD.MAX_NEEDS_IMPROVEMENT,
						);
					break;
				}
				case PromptQualityTier.PROVEN: {
					baseQuery.where(
						`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
						">=",
						QUALITY_SCORE_THRESHOLD.PROVEN,
					);
					break;
				}
				case PromptQualityTier.UNRATED: {
					baseQuery.whereNull(
						`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
					);
					break;
				}
				case PromptQualityTier.USABLE: {
					baseQuery
						.where(
							`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
							">=",
							QUALITY_SCORE_THRESHOLD.USABLE,
						)
						.andWhere(
							`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
							"<",
							QUALITY_SCORE_THRESHOLD.PROVEN,
						);
					break;
				}
			}
		}

		const { averageScore, totalCount } = await this.findAggregate(baseQuery);

		const offset = (page - PaginationValue.DEFAULT_PAGE) * limit;

		const items = await baseQuery
			.clone()
			.select(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.TASK_INTENT}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.PROMPT_BODY}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.CREATED_AT}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.UPDATED_AT}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.USER_ID}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
				raw("?? AS ??", [
					`${WORKSPACE_RELATION}.${WorkspaceColumnName.NAME}`,
					"workspaceName",
				]),
			)
			.joinRelated(WORKSPACE_RELATION)
			.orderBy(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.CREATED_AT}`,
				SortOrder.DESC,
			)
			.offset(offset)
			.limit(limit)
			.castTo<PromptRepositoryItem[]>()
			.execute();

		return {
			averageScore,
			items,
			page,
			pageSize: limit,
			totalCount,
		};
	}

	public async findById(id: number): Promise<null | PromptItemResponseDto> {
		const rows = await this.promptModel
			.knex()
			.select(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.CREATED_AT}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
				PROMPT_ID,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.PROMPT_BODY}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.TASK_INTENT}`,
				PROMPT_WORKSPACE_ID,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.USER_ID}`,
				`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.NAME} as ${SQLAlias.WORKSPACE_NAME}`,
			)
			.from(DatabaseTableName.PROMPTS)
			.innerJoin(
				DatabaseTableName.WORKSPACES,
				PROMPT_WORKSPACE_ID,
				`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`,
			)
			.where(PROMPT_ID, "=", id);

		const [row] = rows as Array<{
			computedScore: null | number;
			createdAt: string;
			efficiencyScore: number;
			id: number;
			promptBody: string;
			taskIntent: string;
			userId: number;
			workspaceId: number;
			workspaceName: string;
		}>;

		if (!row) {
			return null;
		}

		return {
			body: row.promptBody,
			computedScore: row.computedScore,
			createdAt: row.createdAt,
			id: row.id,
			intent: row.taskIntent,
			score: row.efficiencyScore,
			userId: row.userId,
			workspaceId: row.workspaceId,
			workspaceName: row.workspaceName,
		};
	}

	public async findByIdAndUserId(
		id: number,
		userId: number,
	): Promise<null | PromptEntity> {
		const prompt = await this.promptModel.query().findOne({ id, userId });

		return prompt ? this.initializeEntity(prompt) : null;
	}

	public async findByIdForUpdate(
		id: number,
		trx: Transaction,
	): Promise<null | PromptEntity> {
		const prompt = await this.promptModel
			.query(trx)
			.findById(id)
			.forUpdate()
			.execute();

		return prompt ? this.initializeEntity(prompt) : null;
	}

	public async findByWorkspace({
		labelId,
		page,
		size,
		workspaceId,
	}: PromptFindByWorkspacePayload): Promise<PromptDto[]> {
		const query = this.promptModel
			.knex()
			.select<PromptDto[]>(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.COMPUTED_SCORE}`,
				PROMPT_ID,
				`${DatabaseTableName.LABELS}.${LabelColumnName.NAME} as ${LABEL_ALIAS}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.PROMPT_BODY}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.TASK_INTENT}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.USER_ID}`,
				PROMPT_WORKSPACE_ID,
			)
			.from(DatabaseTableName.PROMPTS)
			.offset((page - FIRST_PAGE) * size)
			.limit(size)
			.innerJoin(DatabaseTableName.LABELS, PROMPT_LABEL_ID, LABEL_ID)
			.where(PROMPT_WORKSPACE_ID, "=", workspaceId)
			.orderBy(PROMPT_ID, "desc");

		if (labelId !== undefined) {
			query.where(PROMPT_LABEL_ID, "=", labelId);
		}

		return await query;
	}

	public async findCountByWorkspaceId(workspaceId: number): Promise<number> {
		return await this.promptModel.query().where({ workspaceId }).resultSize();
	}

	public async findPromptsWithoutLabels(
		limit: number,
		afterId: number,
	): Promise<PromptEntity[]> {
		const prompts = await this.promptModel
			.query()
			.limit(limit)
			.whereNull(PromptColumnName.LABEL_ID)
			.orderBy(PromptColumnName.ID)
			.where(PromptColumnName.ID, ">", afterId)
			.execute();

		return prompts.map((prompt) => this.initializeEntity(prompt));
	}

	public async findRecentByWorkspaceId(
		workspaceId: number,
		limit: number,
	): Promise<PromptRecentDto[]> {
		return await this.promptModel
			.query()
			.select(
				PromptColumnName.COMPUTED_SCORE,
				PromptColumnName.EFFICIENCY_SCORE,
				PromptColumnName.ID,
				PromptColumnName.TASK_INTENT,
			)
			.where({ workspaceId })
			.orderBy(PromptColumnName.CREATED_AT, SortOrder.DESC)
			.limit(limit)
			.execute();
	}

	public async findUserPromptSummary(
		userId: number,
	): Promise<PromptAggregateResult> {
		const baseQuery = this.applyFilters(this.promptModel.query(), {
			userId,
		});

		return await this.findAggregate(baseQuery);
	}

	public async update(
		id: number,
		payload: PromptUpdatePayload,
		trx?: Transaction,
	): Promise<null | PromptEntity> {
		const prompt = await this.promptModel
			.query(trx)
			.patchAndFetchById(id, payload)
			.castTo<PromptModel | undefined>();

		return prompt ? this.initializeEntity(prompt) : null;
	}

	public async updateComputedScore(
		id: number,
		computedScore: null | number,
		trx?: Transaction,
	): Promise<void> {
		await this.promptModel.query(trx).findById(id).patch({ computedScore });
	}

	public async updateLabel(promptId: number, labelId: number): Promise<void> {
		await this.promptModel.query().findById(promptId).patch({ labelId });
	}
}

export { PromptRepository };
