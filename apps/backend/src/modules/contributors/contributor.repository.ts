import { type Transaction, UniqueViolationError } from "objection";

import { ContributorError } from "~/libs/exceptions/exceptions.js";

import { ContributorEntity } from "./contributor.entity.js";
import { type ContributorModel } from "./contributor.model.js";

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
}

export { ContributorRepository };
