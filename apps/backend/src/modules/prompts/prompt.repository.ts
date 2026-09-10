import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";

import { WorkspaceColumnName } from "../workspaces/libs/enums/enums.js";
import {
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
	ROUND_FACTOR,
	ZERO_VALUE,
} from "./libs/constants/constants.js";
import { PromptColumnName, PromptScope } from "./libs/enums/enums.js";
import {
	type PromptGetQueryDto,
	type PromptRepositoryFindAllResponseDto,
} from "./libs/types/types.js";

class PromptRepository {
	private promptModel: typeof PromptModel;

	public constructor(promptModel: typeof PromptModel) {
		this.promptModel = promptModel;
	}

	private async findAggregate(
		baseQuery: ReturnType<typeof this.promptModel.query>,
	): Promise<{ averageScore: null | number; totalCount: number }> {
		const [aggregation] = await baseQuery
			.clone()
			.clearSelect()
			.clearOrder()
			.count(`${DatabaseTableName.PROMPTS}.id as count`)
			.avg(`${DatabaseTableName.PROMPTS}.efficiencyScore as averageScore`)
			.castTo<
				{
					averageScore: null | number | string;
					count: number | string;
				}[]
			>()
			.execute();

		const totalCount = Number(aggregation?.count ?? ZERO_VALUE);
		const rawAvg = aggregation?.averageScore
			? Number(aggregation.averageScore)
			: null;
		const averageScore =
			rawAvg === null ? null : Math.round(rawAvg * ROUND_FACTOR) / ROUND_FACTOR;

		return { averageScore, totalCount };
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
	}: {
		query: PromptGetQueryDto;
		userId: number;
	}): Promise<PromptRepositoryFindAllResponseDto> {
		const {
			limit = DEFAULT_LIMIT,
			page = DEFAULT_PAGE,
			scope,
			score,
			search,
			workspaceId,
		} = query;

		const baseQuery = this.promptModel
			.query()
			.leftJoin(
				DatabaseTableName.WORKSPACES,
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.WORKSPACE_ID}`,
				`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`,
			)
			.modify("filterByQuery", {
				scope,
				score,
				search,
				userId,
				workspaceId,
			});

		const { averageScore, totalCount } = await this.findAggregate(baseQuery);

		const offset = (page - DEFAULT_PAGE) * limit;

		const items = await baseQuery
			.clone()
			.select(`${DatabaseTableName.PROMPTS}.*`)
			.withGraphFetched("workspace")
			.orderBy(`${DatabaseTableName.PROMPTS}.createdAt`, "desc")
			.offset(offset)
			.limit(limit)
			.execute();

		return {
			averageScore,
			items,
			page,
			pageSize: limit,
			totalCount,
		};
	}

	public async findUserPromptSummary(
		userId: number,
	): Promise<{ averageScore: null | number; totalCount: number }> {
		const baseQuery = this.promptModel
			.query()
			.modify("filterByQuery", { scope: PromptScope.MINE, userId });

		return await this.findAggregate(baseQuery);
	}
}

export { PromptRepository };
