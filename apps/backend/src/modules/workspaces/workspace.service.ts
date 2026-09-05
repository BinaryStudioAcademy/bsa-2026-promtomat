import { type Transaction } from "objection";

import { WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { type Database } from "~/libs/modules/database/database.js";
import { type PromptRepository } from "~/modules/prompts/prompt.repository.js";

import { MINIMUM_WORKSPACE_COUNT_FOR_DELETION } from "./libs/constants/workspace.constant.js";
import {
	type WorkspaceCreatePayload,
	type WorkspaceDeletionImpactResponseDto,
	type WorkspaceDto,
	type WorkspaceGetAllResponseDto,
	type WorkspaceUpdateRequestDto,
} from "./libs/types/types.js";
import { WorkspaceEntity } from "./workspace.entity.js";
import { type WorkspaceRepository } from "./workspace.repository.js";

class WorkspaceService {
	private database: Database;
	private promptRepository: PromptRepository;

	private workspaceRepository: WorkspaceRepository;

	public constructor(
		workspaceRepository: WorkspaceRepository,
		promptRepository: PromptRepository,
		database: Database,
	) {
		this.workspaceRepository = workspaceRepository;
		this.promptRepository = promptRepository;
		this.database = database;
	}

	public async checkUserAccess(
		workspaceId: number,
		userId: number,
		trx?: Transaction,
	): Promise<void> {
		const workspace = await this.workspaceRepository.findById(workspaceId, trx);

		if (!workspace) {
			throw WorkspaceError.notFound();
		}

		const isOwner = workspace.toObject().userId === userId;

		if (!isOwner) {
			throw WorkspaceError.notFound();
		}
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
			await this.checkUserAccess(workspaceId, userId, trx);

			const workspaces =
				await this.workspaceRepository.findAllByUserIdForUpdate(userId, trx);

			await this.checkUserAccess(workspaceId, userId, trx);

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
		const workspaces = await this.workspaceRepository.findAllByUserId(
			userId,
			workspaceName,
		);

		return {
			items: workspaces.map((workspace) => workspace.toObject()),
		};
	}

	public async findDeletionImpact(
		workspaceId: number,
		userId: number,
	): Promise<WorkspaceDeletionImpactResponseDto> {
		await this.checkUserAccess(workspaceId, userId);

		const [ownedWorkspaceCount, promptCount] = await Promise.all([
			this.workspaceRepository.findCountByUserId(userId),
			this.promptRepository.findCountByWorkspaceId(workspaceId),
		]);

		return {
			canDelete: ownedWorkspaceCount >= MINIMUM_WORKSPACE_COUNT_FOR_DELETION,
			promptCount,
		};
	}

	public async update(
		id: number,
		payload: WorkspaceUpdateRequestDto,
		userId: number,
	): Promise<WorkspaceDto> {
		await this.checkUserAccess(id, userId);

		const updatedWorkspace = await this.workspaceRepository.update(id, payload);

		if (!updatedWorkspace) {
			throw WorkspaceError.notFound();
		}

		return updatedWorkspace.toObject();
	}
}

export { WorkspaceService };
