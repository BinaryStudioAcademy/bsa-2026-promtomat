import { escapeILikePattern } from "~/libs/helpers/helpers.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";

import {
	WorkspaceColumnName,
	WorkspaceVisibility,
} from "../workspaces/libs/enums/enums.js";
import { PromptColumnName, PromptScope } from "./libs/enums/enums.js";
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
		averageScore: number;
		items: PromptModel[];
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
			.modify((builder) => {
				if (scope === PromptScope.MINE) {
					builder.where(`${DatabaseTableName.PROMPTS}.userId`, userId);
				} else {
					builder.where((subQuery) => {
						subQuery
							.where(
								`${DatabaseTableName.WORKSPACES}.visibility`,
								WorkspaceVisibility.PUBLIC,
							)
							.orWhere(`${DatabaseTableName.WORKSPACES}.userId`, userId);
					});
				}

				if (workspaceId) {
					builder.where(
						`${DatabaseTableName.PROMPTS}.workspaceId`,
						workspaceId,
					);
				}

				if (score) {
					builder.where(`${DatabaseTableName.PROMPTS}.efficiencyScore`, score);
				}

				if (search) {
					const escapedSearch = escapeILikePattern(search);
					builder.where((subQuery) => {
						subQuery
							.whereILike(
								`${DatabaseTableName.PROMPTS}.taskIntent`,
								`%${escapedSearch}%`,
							)
							.orWhereILike(
								`${DatabaseTableName.PROMPTS}.promptBody`,
								`%${escapedSearch}%`,
							);
					});
				}
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
		const rawAvg = Number(aggregation?.averageScore ?? ZERO_VALUE);
		const averageScore = Math.round(rawAvg * ROUND_FACTOR) / ROUND_FACTOR;

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
			totalCount,
		};
	}
}

export { PromptRepository };
