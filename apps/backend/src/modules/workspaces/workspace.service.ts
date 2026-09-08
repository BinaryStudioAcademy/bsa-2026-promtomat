import {
	type MembershipDto,
	WorkspaceError,
	WorkspaceRole,
} from "@promptomat/shared";
import { type Transaction } from "objection";

import { type MembershipService } from "~/modules/memberships/membership.service.js";

import {
	type WorkspaceCreatePayload,
	type WorkspaceDto,
	type WorkspaceGetAllResponseDto,
} from "./libs/types/types.js";
import { WorkspaceEntity } from "./workspace.entity.js";
import { type WorkspaceRepository } from "./workspace.repository.js";

class WorkspaceService {
	private membershipService: MembershipService;

	private workspaceRepository: WorkspaceRepository;

	public constructor(
		membershipService: MembershipService,
		workspaceRepository: WorkspaceRepository,
	) {
		this.membershipService = membershipService;
		this.workspaceRepository = workspaceRepository;
	}

	public async addMember(
		requesterId: number,
		workspaceId: number,
		targetUserId: number,
	): Promise<MembershipDto> {
		const requesterMembership =
			await this.membershipService.findByUserIdAndWorkspaceId(
				requesterId,
				workspaceId,
			);

		if (
			requesterMembership === null ||
			requesterMembership.toObject().role !== WorkspaceRole.OWNER
		) {
			throw WorkspaceError.forbidden();
		}

		const membership = await this.membershipService.create({
			role: WorkspaceRole.CONTRIBUTOR,
			userId: targetUserId,
			workspaceId,
		});

		return membership.toObject();
	}

	public async create(
		payload: WorkspaceCreatePayload,
		trx?: Transaction,
	): Promise<WorkspaceDto> {
		const workspace = await this.workspaceRepository.create(
			WorkspaceEntity.initializeNew({
				name: payload.name,
				stackTags: payload.stackTags,
				userId: payload.userId,
				visibility: payload.visibility,
			}),
			trx,
		);

		return workspace.toObject();
	}

	public async findAllByUserId(
		userId: number,
		workspaceName?: string,
	): Promise<WorkspaceGetAllResponseDto> {
		const workspaces = await this.workspaceRepository.findAllByUserId(
			userId,
			workspaceName,
		);

		return {
			items: workspaces.map((workspace) => workspace.toObject()),
		};
	}
}

export { WorkspaceService };
