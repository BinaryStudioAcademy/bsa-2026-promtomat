import { type ValueOf, WorkspaceRole } from "@promptomat/shared";
import { type Transaction } from "objection";

import { MembershipEntity } from "~/modules/memberships/membership.entity.js";
import { MembershipRepository } from "~/modules/memberships/membership.repository.js";

class MembershipService {
	private membershipRepository: MembershipRepository;

	public constructor(membershipRepository: MembershipRepository) {
		this.membershipRepository = membershipRepository;
	}

	public async create(
		payload: {
			role: ValueOf<typeof WorkspaceRole>;
			userId: number;
			workspaceId: number;
		},
		trx?: Transaction,
	): Promise<MembershipEntity> {
		return await this.membershipRepository.create(
			MembershipEntity.initializeNew({
				role: payload.role,
				userId: payload.userId,
				workspaceId: payload.workspaceId,
			}),
			trx,
		);
	}

	public async delete(userId: number, workspaceId: number): Promise<void> {
		await this.membershipRepository.delete(userId, workspaceId);
	}

	public async findByUserIdAndWorkspaceId(
		userId: number,
		workspaceId: number,
	): Promise<MembershipEntity | null> {
		return await this.membershipRepository.findByUserIdAndWorkspaceId(
			userId,
			workspaceId,
		);
	}
}

export { MembershipService };
