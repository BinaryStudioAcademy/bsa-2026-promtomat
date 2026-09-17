import { raw, type Transaction } from "objection";

import { SortOrder } from "~/libs/enums/enums.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { LabelColumnName } from "~/modules/labels/libs/enums/enums.js";
import {
	FIRST_PAGE,
	LABEL_ALIAS,
	LABEL_ID,
	PROMPT_ID,
	PROMPT_LABEL_ID,
	PROMPT_WORKSPACE_ID,
	ZERO_VALUE,
} from "~/modules/prompts/libs/constants/constants.js";
import {
	PaginationValue,
	PromptColumnName,
} from "~/modules/prompts/libs/enums/enums.js";
import { PromptEntity } from "~/modules/prompts/prompt.entity.js";
import { type PromptModel } from "~/modules/prompts/prompt.model.js";

import {
	type PromptAggregateResult,
	type PromptDto,
	type PromptFindAllOptions,
	type PromptFindByWorkspacePayload,
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

	public async create(
		entity: PromptEntity,
		trx?: Transaction,
	): Promise<PromptEntity> {
		const prompt = await this.promptModel
			.query(trx)
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

	public async findById(id: number): Promise<null | PromptEntity> {
		const prompt = await this.promptModel.query().findById(id);

		return prompt ? PromptEntity.initialize(prompt) : null;
	}

	public async findByIdAndUserId(
		id: number,
		userId: number,
	): Promise<null | PromptEntity> {
		const prompt = await this.promptModel.query().findOne({ id, userId });

		return prompt ? PromptEntity.initialize(prompt) : null;
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

		return prompts.map((prompt) => PromptEntity.initialize(prompt));
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

	public async update(
		id: number,
		payload: PromptUpdatePayload,
		trx?: Transaction,
	): Promise<null | PromptEntity> {
		const prompt = await this.promptModel
			.query(trx)
			.patchAndFetchById(id, payload)
			.castTo<PromptModel | undefined>();

		return prompt ? PromptEntity.initialize(prompt) : null;
	}

	public async updateLabel(promptId: number, labelId: number): Promise<void> {
		await this.promptModel.query().findById(promptId).patch({ labelId });
	}
}

export { PromptRepository };
