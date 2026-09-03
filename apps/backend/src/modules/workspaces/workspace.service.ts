import { type Transaction } from "objection";

import { WorkspaceError } from "~/libs/exceptions/exceptions.js";

import {
	type WorkspaceCreateRequestDto,
	type WorkspaceDto,
	type WorkspaceGetAllResponseDto,
} from "./libs/types/types.js";
import { WorkspaceEntity } from "./workspace.entity.js";
import { type WorkspaceRepository } from "./workspace.repository.js";

class WorkspaceService {
	private workspaceRepository: WorkspaceRepository;

	public constructor(workspaceRepository: WorkspaceRepository) {
		this.workspaceRepository = workspaceRepository;
	}

	public async checkUserAccess(
		workspaceId: number,
		userId: number,
	): Promise<void> {
		const workspace = await this.workspaceRepository.findById(workspaceId);

		if (!workspace) {
			throw WorkspaceError.notFound();
		}

		const isOwner = workspace.toObject().userId === userId;

		if (!isOwner) {
			throw WorkspaceError.noPersmissionToAccess();
		}
	}

	public async create(
		payload: WorkspaceCreateRequestDto,
		userId: number,
		trx?: Transaction,
	): Promise<WorkspaceDto> {
		const workspace = await this.workspaceRepository.create(
			WorkspaceEntity.initializeNew({
				name: payload.name,
				stackTags: payload.stackTags,
				userId: userId,
				visibility: payload.visibility,
			}),
			trx,
		);

		return workspace.toObject();
	}

	public async findAllUserWorkspaces(
		userId: number,
		search?: string,
	): Promise<WorkspaceGetAllResponseDto> {
		const workspaces = await this.workspaceRepository.findAllUserWorkspaces(
			userId,
			search,
		);

		return {
			items: workspaces.map((workspace) => workspace.toObject()),
		};
	}
}

export { WorkspaceService };
