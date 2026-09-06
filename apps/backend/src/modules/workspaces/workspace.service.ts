import { type Transaction } from "objection";

import {
	type WorkspaceCreatePayload,
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
