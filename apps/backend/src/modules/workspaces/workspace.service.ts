import { type Transaction } from "objection";

import { FIRST_ELEMENT_INDEX } from "~/libs/constants/constants.js";
import { WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { type Database } from "~/libs/modules/database/database.js";

import {
	MAX_TAGS_COUNT,
	MINIMUM_WORKSPACE_COUNT_FOR_DELETION,
} from "./libs/constants/constants.js";
import { WorkspaceListScope } from "./libs/enums/enums.js";
import {
	type WorkspaceCreatePayload,
	type WorkspaceDto,
	type WorkspaceGetAllRequestDto,
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

	public async appendStackTags(
		workspaceId: number,
		tags: string[],
	): Promise<void> {
		const workspace = await this.workspaceRepository.findById(workspaceId);

		if (!workspace) {
			return;
		}

		const mergedStackTags = [
			...new Set([...workspace.toObject().stackTags, ...tags]),
		].slice(FIRST_ELEMENT_INDEX, MAX_TAGS_COUNT);

		await this.workspaceRepository.update(workspaceId, {
			stackTags: mergedStackTags,
		});
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
			const workspaceCount =
				await this.workspaceRepository.findCountByUserIdWithLock(userId, trx);

			if (workspaceCount < MINIMUM_WORKSPACE_COUNT_FOR_DELETION) {
				throw WorkspaceError.lastWorkspaceDeletionNotAllowed();
			}

			await this.workspaceRepository.deleteById(workspaceId, trx);
		});
	}

	public async findAllByUserId(
		userId: number,
		query: WorkspaceGetAllRequestDto,
	): Promise<WorkspaceGetAllResponseDto> {
		const scope = query.scope ?? WorkspaceListScope.ALL;
		const workspaces = await this.workspaceRepository.findAllByUserId(
			userId,
			scope,
			query.workspaceName,
		);

		return {
			items: workspaces,
		};
	}

	public async findByIdAndContributor(
		id: number,
		userId: number,
	): Promise<null | WorkspaceDto> {
		const workspace =
			await this.workspaceRepository.findByIdAndContributorUserId(id, userId);

		return workspace ? workspace.toObject() : null;
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

		return updatedWorkspace.toObject();
	}
}

export { WorkspaceService };
