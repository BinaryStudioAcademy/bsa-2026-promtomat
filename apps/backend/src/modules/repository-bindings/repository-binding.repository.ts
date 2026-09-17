import { type Transaction, UniqueViolationError } from "objection";

import { RepositoryBindingError } from "~/libs/exceptions/exceptions.js";

import { RepositoryBindingColumnName } from "./libs/enums/enums.js";
import { type RepositoryIdentity } from "./libs/types/types.js";
import { RepositoryBindingEntity } from "./repository-binding.entity.js";
import { type RepositoryBindingModel } from "./repository-binding.model.js";

const RepositoryBindingConstraintName = {
	WORKSPACE_ID_HOST_OWNER_REPO_UNIQUE:
		"repository_bindings_workspace_id_host_owner_repo_unique",
} as const;

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

	public async findWorkspaceIdsByIdentity(
		identity: RepositoryIdentity,
		workspaceIds: number[],
	): Promise<number[]> {
		if (workspaceIds.length === 0) {
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
}

export { RepositoryBindingRepository };
