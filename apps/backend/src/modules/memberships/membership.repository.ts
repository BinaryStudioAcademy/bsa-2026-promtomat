import { ForeignKeyViolationError, type Transaction } from "objection";

import { UserError } from "~/libs/exceptions/exceptions.js";
import { MembershipEntity } from "~/modules/memberships/membership.entity.js";
import { type MembershipModel } from "~/modules/memberships/membership.model.js";

class MembershipRepository {
	private membershipModel: typeof MembershipModel;

	public constructor(membershipModel: typeof MembershipModel) {
		this.membershipModel = membershipModel;
	}

	public async create(
		entity: MembershipEntity,
		trx?: Transaction,
	): Promise<MembershipEntity> {
		try {
			const membership = await this.membershipModel
				.query(trx)
				.insert(entity.toNewObject())
				.returning("*")
				.execute();

			return MembershipEntity.initialize(membership);
		} catch (error) {
			if (error instanceof ForeignKeyViolationError) {
				throw UserError.notFound();
			}

			throw error;
		}
	}

	public async delete(userId: number, workspaceId: number): Promise<void> {
		await this.membershipModel
			.query()
			.delete()
			.where({ userId, workspaceId })
			.execute();
	}

	public async findByUserIdAndWorkspaceId(
		userId: number,
		workspaceId: number,
	): Promise<MembershipEntity | null> {
		const membership = await this.membershipModel
			.query()
			.findOne({ userId, workspaceId })
			.execute();

		return membership ? MembershipEntity.initialize(membership) : null;
	}
}

export { MembershipRepository };
