import {
	NotFoundError,
	type Transaction,
	UniqueViolationError,
} from "objection";

import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { RepositoryBindingError } from "~/libs/exceptions/exceptions.js";

import {
	RepositoryBindingColumnName,
	RepositoryBindingConstraintName,
} from "./libs/enums/enums.js";
import { type RepositoryIdentity } from "./libs/types/types.js";
import { RepositoryBindingEntity } from "./repository-binding.entity.js";
import { type RepositoryBindingModel } from "./repository-binding.model.js";

class RepositoryBindingRepository {
	private repositoryBindingModel: typeof RepositoryBindingModel;

	public constructor(repositoryBindingModel: typeof RepositoryBindingModel) {
		this.repositoryBindingModel = repositoryBindingModel;
	}

	public async create(
		entity: RepositoryBindingEntity,
		trx?: Transaction,
	): Promise<RepositoryBindingEntity> {
		try {
			const repositoryBinding = await this.repositoryBindingModel
				.query(trx)
				.insert(entity.toNewObject())
				.returning("*")
				.execute();

			return RepositoryBindingEntity.initialize(repositoryBinding);
		} catch (error) {
			if (
				error instanceof UniqueViolationError &&
				error.constraint ===
					RepositoryBindingConstraintName.WORKSPACE_ID_HOST_OWNER_REPO_UNIQUE
			) {
				throw RepositoryBindingError.alreadyExists();
			}

			throw error;
		}
	}

	public async deleteById(id: number): Promise<number> {
		return await this.repositoryBindingModel.query().deleteById(id).execute();
	}

	public async findAllByWorkspaceId(
		workspaceId: number,
	): Promise<RepositoryBindingEntity[]> {
		const repositoryBindings = await this.repositoryBindingModel
			.query()
			.where(RepositoryBindingColumnName.WORKSPACE_ID, workspaceId)
			.execute();

		return repositoryBindings.map((repositoryBinding) =>
			RepositoryBindingEntity.initialize(repositoryBinding),
		);
	}

	public async findById(id: number): Promise<null | RepositoryBindingEntity> {
		const repositoryBinding = await this.repositoryBindingModel
			.query()
			.findById(id);

		return repositoryBinding
			? RepositoryBindingEntity.initialize(repositoryBinding)
			: null;
	}

	public async findWorkspaceIdsByIdentity(
		identity: RepositoryIdentity,
		workspaceIds: number[],
	): Promise<number[]> {
		if (workspaceIds.length === EMPTY_LENGTH) {
			return [];
		}

		const repositoryBindings = await this.repositoryBindingModel
			.query()
			.select(RepositoryBindingColumnName.WORKSPACE_ID)
			.where(RepositoryBindingColumnName.HOST, identity.host)
			.where(RepositoryBindingColumnName.OWNER, identity.owner)
			.where(RepositoryBindingColumnName.REPO, identity.repo)
			.whereIn(RepositoryBindingColumnName.WORKSPACE_ID, workspaceIds)
			.execute();

		return repositoryBindings.map(
			(repositoryBinding) => repositoryBinding.workspaceId,
		);
	}

	public async update(
		id: number,
		identity: RepositoryIdentity,
	): Promise<RepositoryBindingEntity> {
		try {
			const repositoryBinding = await this.repositoryBindingModel
				.query()
				.patchAndFetchById(id, {
					host: identity.host,
					owner: identity.owner,
					repo: identity.repo,
				})
				.throwIfNotFound();

			return RepositoryBindingEntity.initialize(repositoryBinding);
		} catch (error) {
			if (
				error instanceof UniqueViolationError &&
				error.constraint ===
					RepositoryBindingConstraintName.WORKSPACE_ID_HOST_OWNER_REPO_UNIQUE
			) {
				throw RepositoryBindingError.alreadyExists();
			}

			if (error instanceof NotFoundError) {
				throw RepositoryBindingError.notFound();
			}

			throw error;
		}
	}
}

export { RepositoryBindingRepository };
