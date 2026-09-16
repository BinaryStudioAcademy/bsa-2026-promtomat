import { raw } from "objection";

import { SortOrder } from "~/libs/enums/enums.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";

import { ZERO_VALUE } from "./libs/constants/constants.js";
import { PaginationValue } from "./libs/enums/enums.js";
import {
	type PromptAggregateResult,
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

	private async findAggregate(
		baseQuery: ReturnType<typeof this.promptModel.query>,
	): Promise<PromptAggregateResult> {
		const [aggregation] = await baseQuery
			.clone()
			.clearSelect()
			.clearOrder()
			.clear("limit")
			.clear("offset")
			.count(`${DatabaseTableName.PROMPTS}.id as count`)
			.avg(`${DatabaseTableName.PROMPTS}.efficiencyScore as averageScore`)
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
			search,
			workspaceId,
		} = query;

		const baseQuery = this.promptModel.query().modify("filterByQuery", {
			score,
			search,
			userId,
			workspaceId,
		});

		const { averageScore, totalCount } = await this.findAggregate(baseQuery);

		const offset = (page - PaginationValue.DEFAULT_PAGE) * limit;

		const items = await baseQuery
			.clone()
			.select(
				`${DatabaseTableName.PROMPTS}.id`,
				`${DatabaseTableName.PROMPTS}.taskIntent`,
				`${DatabaseTableName.PROMPTS}.promptBody`,
				`${DatabaseTableName.PROMPTS}.efficiencyScore`,
				`${DatabaseTableName.PROMPTS}.createdAt`,
				`${DatabaseTableName.PROMPTS}.updatedAt`,
				`${DatabaseTableName.PROMPTS}.userId`,
				`${DatabaseTableName.PROMPTS}.workspaceId`,
				raw("?? AS ??", ["workspace.name", "workspaceName"]),
			)
			.joinRelated("workspace")
			.orderBy(`${DatabaseTableName.PROMPTS}.createdAt`, "desc")
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
			.select("efficiencyScore", "id", "taskIntent")
			.where({ workspaceId })
			.orderBy("createdAt", SortOrder.DESC)
			.limit(limit)
			.execute();
	}

	public async findUserPromptSummary(
		userId: number,
	): Promise<PromptAggregateResult> {
		const baseQuery = this.promptModel
			.query()
			.modify("filterByQuery", { userId });

		return await this.findAggregate(baseQuery);
	}
}

export { PromptRepository };
