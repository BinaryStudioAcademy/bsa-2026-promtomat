import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";

import { WorkspaceColumnName } from "../workspaces/libs/enums/enums.js";
import { PromptColumnName } from "./libs/enums/enums.js";
import { type PromptGetQueryDto } from "./libs/types/types.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const ZERO_VALUE = 0;
const ROUND_FACTOR = 10;

class PromptRepository {
	private promptModel: typeof PromptModel;

	public constructor(promptModel: typeof PromptModel) {
		this.promptModel = promptModel;
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
	}): Promise<{
		averageScore: null | number;
		items: PromptModel[];
		page: number;
		pageSize: number;
		totalCount: number;
	}> {
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

		const [aggregation] = (await baseQuery
			.clone()
			.clearSelect()
			.clearOrder()
			.count(`${DatabaseTableName.PROMPTS}.id as count`)
			.avg(
				`${DatabaseTableName.PROMPTS}.efficiencyScore as averageScore`,
			)) as unknown as {
			averageScore: null | number | string;
			count: number | string;
		}[];

		const totalCount = Number(aggregation?.count ?? ZERO_VALUE);
		const rawAvg = aggregation?.averageScore
			? Number(aggregation.averageScore)
			: null;
		const averageScore =
			rawAvg === null ? null : Math.round(rawAvg * ROUND_FACTOR) / ROUND_FACTOR;

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
}

export { PromptRepository };
