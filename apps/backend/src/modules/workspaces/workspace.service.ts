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

	public async create(
		payload: WorkspaceCreateRequestDto,
		userId: number,
		trx?: Transaction,
	): Promise<WorkspaceDto> {
		const existingWorkspace = await this.workspaceRepository.findByNameAndUser(
			payload.name,
			userId,
		);

		if (existingWorkspace) {
			throw WorkspaceError.nameAlreadyExists();
		}

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
