import {
	NotFoundError,
	type QueryBuilder,
	type Transaction,
	UniqueViolationError,
} from "objection";

import { SortOrder } from "~/libs/enums/enums.js";
import { WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { escapeILikePattern } from "~/libs/helpers/helpers.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";

import { ContributorColumnName } from "../contributors/libs/enums/enums.js";
import { PromptColumnName } from "../prompts/libs/enums/enums.js";
import {
	PROMPTS_RELATION,
	WORKSPACE_OWNER_COUNT,
} from "./libs/constants/constants.js";
import { WorkspaceColumnName, WorkspaceListScope } from "./libs/enums/enums.js";
import {
	type WorkspaceListItemDto,
	type WorkspaceUpdateRequestDto,
} from "./libs/types/types.js";
import { WorkspaceEntity } from "./workspace.entity.js";
import { type WorkspaceModel } from "./workspace.model.js";

type WorkspaceWithCountsRow = WorkspaceModel & {
	contributorCount: string;
	promptCount: string;
};

class WorkspaceRepository {
	private workspaceModel: typeof WorkspaceModel;

	public constructor(workspaceModel: typeof WorkspaceModel) {
		this.workspaceModel = workspaceModel;
	}

	private buildWorkspaceWithCountsQuery(): QueryBuilder<
		WorkspaceModel,
		WorkspaceModel[]
	> {
		return this.workspaceModel
			.query()
			.select(`${DatabaseTableName.WORKSPACES}.*`)
			.countDistinct(
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.ID} as contributorCount`,
			)
			.countDistinct(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.ID} as promptCount`,
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
		const workspaceDto = WorkspaceEntity.initialize(row).toObject();

		return {
			...workspaceDto,
			memberCount,
			promptCount,
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
		scope: ValueOf<typeof WorkspaceListScope>,
		workspaceName?: string,
	): Promise<WorkspaceListItemDto[]> {
		const query = this.buildWorkspaceWithCountsQuery().orderBy(
			`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.CREATED_AT}`,
			SortOrder.DESC,
		);

		this.filterByListScope(query, userId, scope);
		this.filterByNameOrTag(query, workspaceName);

		const workspaces = await query.castTo<WorkspaceWithCountsRow[]>().execute();

		return workspaces.map((workspace) => this.toWorkspaceWithCounts(workspace));
	}

	public async findById(id: number): Promise<null | WorkspaceEntity> {
		const workspace = await this.workspaceModel.query().findById(id);

		if (!workspace) {
			return null;
		}

		return WorkspaceEntity.initialize(workspace);
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
