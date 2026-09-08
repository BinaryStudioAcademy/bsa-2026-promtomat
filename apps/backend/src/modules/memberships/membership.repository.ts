import { type Transaction } from "objection";

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
		const membership = await this.membershipModel
			.query(trx)
			.insert(entity.toNewObject())
			.returning("*")
			.execute();
		return MembershipEntity.initialize(membership);
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
