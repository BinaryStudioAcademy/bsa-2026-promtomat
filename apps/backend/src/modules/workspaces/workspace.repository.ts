import {
	NotFoundError,
	type QueryBuilder,
	raw,
	type Transaction,
	UniqueViolationError,
} from "objection";

import { SortOrder, SQLAlias } from "~/libs/enums/enums.js";
import { WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { escapeILikePattern } from "~/libs/helpers/helpers.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";

import { ContributorColumnName } from "../contributors/libs/enums/enums.js";
import { PromptColumnName } from "../prompts/libs/enums/enums.js";
import {
	PROMPTS_RELATION,
	RECENT_ACTIVITY_DAYS,
	WORKSPACE_OWNER_COUNT,
} from "./libs/constants/constants.js";
import {
	WorkspaceColumnName,
	WorkspaceListScope,
	WorkspaceListSort,
} from "./libs/enums/enums.js";
import {
	type WorkspaceListItemDto,
	type WorkspaceUpdateRequestDto,
} from "./libs/types/types.js";
import { WorkspaceEntity } from "./workspace.entity.js";
import { type WorkspaceModel } from "./workspace.model.js";

type WorkspaceWithCountsRow = WorkspaceModel & {
	averageScore: null | string;
	contributorCount: string;
	promptCount: string;
	recentActivity: string;
};

class WorkspaceRepository {
	private workspaceModel: typeof WorkspaceModel;

	public constructor(workspaceModel: typeof WorkspaceModel) {
		this.workspaceModel = workspaceModel;
	}

	private applyListSort(
		query: QueryBuilder<WorkspaceModel, WorkspaceModel[]>,
		sort?: ValueOf<typeof WorkspaceListSort>,
	): void {
		const workspaceId = `${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`;

		if (sort === WorkspaceListSort.RECENT_ACTIVITY) {
			query
				.orderBy(SQLAlias.RECENT_ACTIVITY, SortOrder.DESC)
				.orderBy(workspaceId, SortOrder.ASC);

			return;
		}

		if (sort === WorkspaceListSort.READINESS) {
			query
				.orderByRaw(`(??)::double precision / ?? ${SortOrder.DESC}`, [
					SQLAlias.PROMPT_COUNT,
					`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.DATASET_TARGET}`,
				])
				.orderBy(workspaceId, SortOrder.ASC);

			return;
		}

		if (sort === WorkspaceListSort.AVERAGE_SCORE) {
			query
				.orderByRaw(`?? ${SortOrder.DESC} NULLS LAST`, [SQLAlias.AVERAGE_SCORE])
				.orderBy(workspaceId, SortOrder.ASC);

			return;
		}

		query
			.orderBy(
				`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.CREATED_AT}`,
				SortOrder.DESC,
			)
			.orderBy(workspaceId, SortOrder.ASC);
	}

	private buildWorkspaceWithCountsQuery(): QueryBuilder<
		WorkspaceModel,
		WorkspaceModel[]
	> {
		const promptId = `${DatabaseTableName.PROMPTS}.${PromptColumnName.ID}`;
		const promptCreatedAt = `${DatabaseTableName.PROMPTS}.${PromptColumnName.CREATED_AT}`;

		return this.workspaceModel
			.query()
			.select(`${DatabaseTableName.WORKSPACES}.*`)
			.countDistinct(
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.ID} as contributorCount`,
			)
			.countDistinct(`${promptId} as ${SQLAlias.PROMPT_COUNT}`)
			.avg(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.EFFICIENCY_SCORE} as ${SQLAlias.AVERAGE_SCORE}`,
			)
			.select(
				raw(
					"count(distinct case when ?? >= now() - make_interval(days => ?) then ?? end) as ??",
					[
						promptCreatedAt,
						RECENT_ACTIVITY_DAYS,
						promptId,
						SQLAlias.RECENT_ACTIVITY,
					],
				),
			)
			.leftJoin(
				DatabaseTableName.CONTRIBUTORS,
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.WORKSPACE_ID}`,
				`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`,
			)
			.leftJoinRelated(PROMPTS_RELATION)
			.groupBy(`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`);
	}

	private filterByListScope(
		query: QueryBuilder<WorkspaceModel, WorkspaceModel[]>,
		userId: number,
		scope: ValueOf<typeof WorkspaceListScope>,
	): void {
		const contributorAccessQuery = this.workspaceModel
			.query()
			.select(`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.ID}`)
			.from(DatabaseTableName.CONTRIBUTORS)
			.whereColumn(
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.WORKSPACE_ID}`,
				`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`,
			)
			.where(
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.USER_ID}`,
				userId,
			);

		if (scope === WorkspaceListScope.ALL) {
			query.where((builder) => {
				builder
					.where(
						`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.USER_ID}`,
						userId,
					)
					.orWhereExists(contributorAccessQuery);
			});

			return;
		}

		if (scope === WorkspaceListScope.OWNED) {
			query.where(
				`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.USER_ID}`,
				userId,
			);

			return;
		}

		query.whereExists(contributorAccessQuery);
	}

	private filterByNameOrTag(
		query: QueryBuilder<WorkspaceModel, WorkspaceModel[]>,
		workspaceName?: string,
	): void {
		if (!workspaceName) {
			return;
		}

		const escapedWorkspaceName = escapeILikePattern(workspaceName);
		const searchPattern = `%${escapedWorkspaceName}%`;

		query.where((builder) => {
			builder
				.whereILike(
					`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.NAME}`,
					searchPattern,
				)
				.orWhereRaw(
					"EXISTS (SELECT 1 FROM unnest(stack_tags) AS tag WHERE tag ILIKE ?)",
					[searchPattern],
				);
		});
	}

	private toWorkspaceWithCounts(
		row: WorkspaceWithCountsRow,
	): WorkspaceListItemDto {
		const contributorCount = Number(row.contributorCount);
		const memberCount = contributorCount + WORKSPACE_OWNER_COUNT;
		const promptCount = Number(row.promptCount);
		const recentActivity = Number(row.recentActivity);
		const averageScore =
			row.averageScore === null ? null : Number(row.averageScore);
		const workspaceDto = WorkspaceEntity.initialize(row).toObject();

		return {
			...workspaceDto,
			averageScore,
			memberCount,
			promptCount,
			recentActivity,
		};
	}

	public async create(
		entity: WorkspaceEntity,
		trx?: Transaction,
	): Promise<WorkspaceEntity> {
		try {
			const workspace = await this.workspaceModel
				.query(trx)
				.insert(entity.toNewObject())
				.execute();

			return WorkspaceEntity.initialize(workspace);
		} catch (error) {
			if (error instanceof UniqueViolationError) {
				throw WorkspaceError.nameAlreadyExists();
			}
			throw error;
		}
	}

	public async deleteById(id: number, trx: Transaction): Promise<void> {
		await this.workspaceModel.query(trx).deleteById(id).execute();
	}

	public async findAllByUserId(
		userId: number,
		query: {
			scope: ValueOf<typeof WorkspaceListScope>;
			sort?: undefined | ValueOf<typeof WorkspaceListSort>;
			workspaceName?: string | undefined;
		},
	): Promise<WorkspaceListItemDto[]> {
		const queryBuilder = this.buildWorkspaceWithCountsQuery();

		this.applyListSort(queryBuilder, query.sort);
		this.filterByListScope(queryBuilder, userId, query.scope);
		this.filterByNameOrTag(queryBuilder, query.workspaceName);

		const workspaces = await queryBuilder
			.castTo<WorkspaceWithCountsRow[]>()
			.execute();

		return workspaces.map((workspace) => this.toWorkspaceWithCounts(workspace));
	}

	public async findByIdAndContributorUserId(
		id: number,
		contributorUserId: number,
	): Promise<null | WorkspaceEntity> {
		const workspace = await this.workspaceModel
			.query()
			.select(`${DatabaseTableName.WORKSPACES}.*`)
			.innerJoin(
				DatabaseTableName.CONTRIBUTORS,
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.WORKSPACE_ID}`,
				`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`,
			)
			.where(`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`, id)
			.where(
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.USER_ID}`,
				contributorUserId,
			)
			.first();

		return workspace ? WorkspaceEntity.initialize(workspace) : null;
	}

	public async findByIdAndUserId(
		id: number,
		userId: number,
	): Promise<null | WorkspaceEntity> {
		const workspace = await this.workspaceModel.query().findOne({ id, userId });

		return workspace ? WorkspaceEntity.initialize(workspace) : null;
	}

	public async findByIdWithCounts(
		id: number,
	): Promise<null | WorkspaceListItemDto> {
		const [workspace] = await this.buildWorkspaceWithCountsQuery()
			.where(`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`, id)
			.castTo<WorkspaceWithCountsRow[]>()
			.execute();

		return workspace ? this.toWorkspaceWithCounts(workspace) : null;
	}

	public async findCountByUserIdWithLock(
		userId: number,
		trx: Transaction,
	): Promise<number> {
		const workspaces = await this.workspaceModel
			.query(trx)
			.select(WorkspaceColumnName.ID)
			.where({ userId })
			.orderBy(WorkspaceColumnName.ID)
			.forUpdate()
			.execute();

		return workspaces.length;
	}

	public async update(
		id: number,
		payload: WorkspaceUpdateRequestDto,
	): Promise<WorkspaceEntity> {
		try {
			const workspace = await this.workspaceModel
				.query()
				.patchAndFetchById(id, payload)
				.throwIfNotFound();

			return WorkspaceEntity.initialize(workspace);
		} catch (error) {
			if (error instanceof UniqueViolationError) {
				throw WorkspaceError.nameAlreadyExists();
			}

			if (error instanceof NotFoundError) {
				throw WorkspaceError.notFound();
			}

			throw error;
		}
	}
}

export { WorkspaceRepository };
