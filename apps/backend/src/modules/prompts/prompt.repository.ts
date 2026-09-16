import { raw } from "objection";

import {
	AVERAGE_SCORE_ALIAS,
	COUNT_ALIAS,
	WORKSPACE_NAME_ALIAS,
} from "~/libs/constants/constants.js";
import { QueryClearTarget, SortOrder } from "~/libs/enums/enums.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";
import { WorkspaceColumnName } from "~/modules/workspaces/libs/enums/enums.js";

import { WORKSPACE_RELATION, ZERO_VALUE } from "./libs/constants/constants.js";
import { PaginationValue, PromptColumnName } from "./libs/enums/enums.js";
import {
	type PromptAggregateResult,
	type PromptFilterByQueryParameters,
	type PromptFindAllOptions,
	type PromptRecentDto,
	type PromptRepositoryFindAllResponseDto,
	type PromptRepositoryItem,
} from "./libs/types/types.js";

class PromptRepository {
	private promptModel: typeof PromptModel;

	public constructor(promptModel: typeof PromptModel) {
		this.promptModel = promptModel;
	}

	private applyFilters(
		query: ReturnType<typeof this.promptModel.query>,
		{ score, userId, workspaceId }: PromptFilterByQueryParameters,
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

		if (score) {
			query.where(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE}`,
				score,
			);
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
			.count(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.ID} as ${COUNT_ALIAS}`,
			)
			.avg(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE} as ${AVERAGE_SCORE_ALIAS}`,
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

	public async create(entity: PromptEntity): Promise<PromptEntity> {
		const prompt = await this.promptModel
			.query()
			.insert(entity.toNewObject())
			.returning("*")
			.execute();

		return PromptEntity.initialize(prompt);
	}

	public async findAll({
		query,
		userId,
	}: PromptFindAllOptions): Promise<PromptRepositoryFindAllResponseDto> {
		const {
			limit = PaginationValue.DEFAULT_LIMIT,
			page = PaginationValue.DEFAULT_PAGE,
			score,
			workspaceId,
		} = query;

		const baseQuery = this.applyFilters(this.promptModel.query(), {
			score,
			userId,
			workspaceId,
		});

		const { averageScore, totalCount } = await this.findAggregate(baseQuery);

		const offset = (page - PaginationValue.DEFAULT_PAGE) * limit;

		const items = await baseQuery
			.clone()
			.select(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.TASK_INTENT}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.PROMPT_BODY}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.CREATED_AT}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.UPDATED_AT}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.USER_ID}`,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
				raw("?? AS ??", [
					`${WORKSPACE_RELATION}.${WorkspaceColumnName.NAME}`,
					WORKSPACE_NAME_ALIAS,
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

	public async findCountByWorkspaceId(workspaceId: number): Promise<number> {
		return await this.promptModel.query().where({ workspaceId }).resultSize();
	}

	public async findRecentByWorkspaceId(
		workspaceId: number,
		limit: number,
	): Promise<PromptRecentDto[]> {
		return await this.promptModel
			.query()
			.select(
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
		const baseQuery = this.applyFilters(this.promptModel.query(), { userId });

		return await this.findAggregate(baseQuery);
	}
}

export { PromptRepository };
