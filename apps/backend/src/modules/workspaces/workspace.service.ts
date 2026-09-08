import { type Transaction } from "objection";

import { WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { type Database } from "~/libs/modules/database/database.js";

import { MINIMUM_WORKSPACE_COUNT_FOR_DELETION } from "./libs/constants/workspace.constant.js";
import {
	type WorkspaceCreatePayload,
	type WorkspaceDto,
	type WorkspaceGetAllResponseDto,
	type WorkspaceUpdateRequestDto,
} from "./libs/types/types.js";
import { WorkspaceEntity } from "./workspace.entity.js";
import { type WorkspaceRepository } from "./workspace.repository.js";

class WorkspaceService {
	private database: Database;

	private workspaceRepository: WorkspaceRepository;

	public constructor(
		workspaceRepository: WorkspaceRepository,
		database: Database,
	) {
		this.workspaceRepository = workspaceRepository;
		this.database = database;
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

	public async delete(workspaceId: number, userId: number): Promise<void> {
		await this.database.transaction(async (trx) => {
			const workspaces =
				await this.workspaceRepository.findAllByUserIdForUpdate(userId, trx);

			if (workspaces.length < MINIMUM_WORKSPACE_COUNT_FOR_DELETION) {
				throw WorkspaceError.lastWorkspaceDeletionNotAllowed();
			}

			await this.workspaceRepository.deleteById(workspaceId, trx);
		});
	}

	public async findAllByUserId(
		userId: number,
		workspaceName?: string,
	): Promise<WorkspaceGetAllResponseDto> {
		const workspaceItems = await this.workspaceRepository.findAllByUserId(
			userId,
			workspaceName,
		);

		return {
			items: workspaceItems,
		};
	}

	public async findByIdAndOwner(
		id: number,
		userId: number,
	): Promise<null | WorkspaceDto> {
		const workspace = await this.workspaceRepository.findByIdAndUserId(
			id,
			userId,
		);

		return workspace ? workspace.toObject() : null;
	}

	public async update(
		id: number,
		payload: WorkspaceUpdateRequestDto,
	): Promise<WorkspaceDto> {
		const updatedWorkspace = await this.workspaceRepository.update(id, payload);

		if (!updatedWorkspace) {
			throw WorkspaceError.notFound();
		}

		return updatedWorkspace.toObject();
	}
}

export { WorkspaceService };
