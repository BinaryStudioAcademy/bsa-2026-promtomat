import {
	NotFoundError,
	type Transaction,
	UniqueViolationError,
} from "objection";

import {
	ContributorError,
	WorkspaceError,
} from "~/libs/exceptions/exceptions.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { UserColumnName } from "../users/libs/enums/enums.js";
import { WorkspaceColumnName } from "../workspaces/libs/enums/enums.js";
import { type WorkspaceUserSummaryDto } from "../workspaces/libs/types/types.js";
import { ContributorEntity } from "./contributor.entity.js";
import { type ContributorModel } from "./contributor.model.js";
import { ContributorColumnName } from "./libs/enums/enums.js";

const ContributorsConstraintName = {
	USER_ID_WORKSPACE_ID_UNIQUE: "contributors_user_id_workspace_id_unique",
} as const;

class ContributorRepository {
	private contributorModel: typeof ContributorModel;

	public constructor(contributorModel: typeof ContributorModel) {
		this.contributorModel = contributorModel;
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
