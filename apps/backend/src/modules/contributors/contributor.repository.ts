import {
	NotFoundError,
	type QueryBuilder,
	type Transaction,
	UniqueViolationError,
} from "objection";

import {
	ContributorError,
	WorkspaceError,
} from "~/libs/exceptions/exceptions.js";
import { escapeILikePattern } from "~/libs/helpers/helpers.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { UserColumnName } from "../users/libs/enums/enums.js";
import { WorkspaceColumnName } from "../workspaces/libs/enums/enums.js";
import {
	type WorkspaceContributorCandidatesCursor,
	type WorkspaceUserSummaryDto,
} from "../workspaces/libs/types/types.js";
import { ContributorEntity } from "./contributor.entity.js";
import { type ContributorModel } from "./contributor.model.js";
import { ContributorColumnName } from "./libs/enums/enums.js";
import { type ContributorCandidateQuery } from "./libs/types/types.js";

const ContributorsConstraintName = {
	USER_ID_WORKSPACE_ID_UNIQUE: "contributors_user_id_workspace_id_unique",
} as const;

class ContributorRepository {
	private contributorModel: typeof ContributorModel;

	public constructor(contributorModel: typeof ContributorModel) {
		this.contributorModel = contributorModel;
	}

	private filterByCursor(
		query: QueryBuilder<ContributorModel, ContributorModel[]>,
		cursor?: WorkspaceContributorCandidatesCursor,
	): void {
		if (!cursor) {
			return;
		}

		const userId = `${DatabaseTableName.USERS}.${UserColumnName.ID}`;
		const userNickname = `${DatabaseTableName.USERS}.${UserColumnName.NICKNAME}`;

		query.where((builder) => {
			builder
				.where(userNickname, ">", cursor.nickname)
				.orWhere((sameNicknameBuilder) => {
					sameNicknameBuilder
						.where(userNickname, cursor.nickname)
						.andWhere(userId, ">", cursor.id);
				});
		});
	}

	private filterByUserQuery(
		query: QueryBuilder<ContributorModel, ContributorModel[]>,
		userQuery: string,
	): void {
		if (!userQuery) {
			return;
		}

		const escapedUserQuery = escapeILikePattern(userQuery);
		const searchPattern = `%${escapedUserQuery}%`;

		query.where((builder) => {
			builder
				.whereILike(
					`${DatabaseTableName.USERS}.${UserColumnName.NICKNAME}`,
					searchPattern,
				)
				.orWhereILike(
					`${DatabaseTableName.USERS}.${UserColumnName.EMAIL}`,
					searchPattern,
				);
		});
	}

	private filterOutExistingContributors(
		query: QueryBuilder<ContributorModel, ContributorModel[]>,
		workspaceId: number,
	): void {
		const contributorExistsQuery = this.contributorModel
			.query()
			.select(`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.ID}`)
			.whereColumn(
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.USER_ID}`,
				`${DatabaseTableName.USERS}.${UserColumnName.ID}`,
			)
			.where(
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.WORKSPACE_ID}`,
				workspaceId,
			);

		query.whereNotExists(contributorExistsQuery);
	}

	public async create(
		entity: ContributorEntity,
		trx?: Transaction,
	): Promise<ContributorEntity> {
		try {
			const contributor = await this.contributorModel
				.query(trx)
				.insert(entity.toNewObject())
				.returning("*")
				.execute();

			return ContributorEntity.initialize(contributor);
		} catch (error) {
			if (
				error instanceof UniqueViolationError &&
				error.constraint ===
					ContributorsConstraintName.USER_ID_WORKSPACE_ID_UNIQUE
			) {
				throw ContributorError.alreadyExists();
			}

			throw error;
		}
	}

	public async deleteByWorkspaceIdAndUserId(
		workspaceId: number,
		userId: number,
	): Promise<number> {
		const deletedContributorCount = await this.contributorModel
			.query()
			.delete()
			.where(ContributorColumnName.WORKSPACE_ID, workspaceId)
			.andWhere(ContributorColumnName.USER_ID, userId)
			.execute();

		return deletedContributorCount;
	}

	public async findAllByWorkspaceId(
		workspaceId: number,
	): Promise<WorkspaceUserSummaryDto[]> {
		const contributors = await this.contributorModel
			.query()
			.select(
				`${DatabaseTableName.USERS}.${UserColumnName.ID}`,
				`${DatabaseTableName.USERS}.${UserColumnName.EMAIL}`,
				`${DatabaseTableName.USERS}.${UserColumnName.NICKNAME}`,
			)
			.innerJoin(
				DatabaseTableName.USERS,
				`${DatabaseTableName.USERS}.${UserColumnName.ID}`,
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.USER_ID}`,
			)
			.where(
				`${DatabaseTableName.CONTRIBUTORS}.${ContributorColumnName.WORKSPACE_ID}`,
				workspaceId,
			)
			.castTo<WorkspaceUserSummaryDto[]>()
			.execute();

		return contributors;
	}

	public async findCandidates({
		cursor,
		limit,
		ownerId,
		userQuery,
		workspaceId,
	}: ContributorCandidateQuery): Promise<WorkspaceUserSummaryDto[]> {
		const userId = `${DatabaseTableName.USERS}.${UserColumnName.ID}`;
		const userNickname = `${DatabaseTableName.USERS}.${UserColumnName.NICKNAME}`;

		const query = this.contributorModel
			.query()
			.select(
				userId,
				`${DatabaseTableName.USERS}.${UserColumnName.EMAIL}`,
				userNickname,
			)
			.from(DatabaseTableName.USERS)
			.whereNot(userId, ownerId);

		this.filterOutExistingContributors(query, workspaceId);
		this.filterByUserQuery(query, userQuery);
		this.filterByCursor(query, cursor);

		const candidates = await query
			.orderBy(userNickname)
			.orderBy(userId)
			.limit(limit)
			.castTo<WorkspaceUserSummaryDto[]>()
			.execute();

		return candidates;
	}

	public async findOwnerByWorkspaceId(
		workspaceId: number,
	): Promise<WorkspaceUserSummaryDto> {
		try {
			const owner = await this.contributorModel
				.query()
				.select(
					`${DatabaseTableName.USERS}.${UserColumnName.ID}`,
					`${DatabaseTableName.USERS}.${UserColumnName.EMAIL}`,
					`${DatabaseTableName.USERS}.${UserColumnName.NICKNAME}`,
				)
				.from(DatabaseTableName.WORKSPACES)
				.innerJoin(
					DatabaseTableName.USERS,
					`${DatabaseTableName.USERS}.${UserColumnName.ID}`,
					`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.USER_ID}`,
				)
				.where(
					`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`,
					workspaceId,
				)
				.first()
				.throwIfNotFound()
				.castTo<WorkspaceUserSummaryDto>()
				.execute();

			return owner;
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw WorkspaceError.notFound();
			}

			throw error;
		}
	}
}

export { ContributorRepository };
