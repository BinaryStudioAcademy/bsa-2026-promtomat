import { type Transaction } from "objection";

import { WorkspaceError } from "~/libs/exceptions/exceptions.js";

import {
	type WorkspaceCreateRequestDto,
	type WorkspaceDto,
	type WorkspaceGetAllResponseDto,
	type WorkspaceUpdateRequestDto,
} from "./libs/types/types.js";
import { WorkspaceEntity } from "./workspace.entity.js";
import { type WorkspaceRepository } from "./workspace.repository.js";

class WorkspaceService {
	private workspaceRepository: WorkspaceRepository;

	public constructor(workspaceRepository: WorkspaceRepository) {
		this.workspaceRepository = workspaceRepository;
	}

	public async create(
		payload: Omit<WorkspaceCreateRequestDto, "stackTags" | "visibility"> &
			Partial<WorkspaceCreateRequestDto> & { userId: number },
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

	public async update(
		id: number,
		payload: WorkspaceUpdateRequestDto,
		userId: number,
	): Promise<WorkspaceDto> {
		const workspace = await this.workspaceRepository.findById(id);

		if (!workspace || workspace.toObject().userId !== userId) {
			throw WorkspaceError.notFound();
		}

		const updatedWorkspace = await this.workspaceRepository.update(id, payload);

		return updatedWorkspace.toObject();
	}
}

export { WorkspaceService };
