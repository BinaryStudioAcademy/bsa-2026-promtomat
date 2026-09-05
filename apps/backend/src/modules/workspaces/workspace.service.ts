import { type Transaction } from "objection";

import { WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { type PromptRepository } from "~/modules/prompts/prompt.repository.js";

import { MINIMUM_WORKSPACE_COUNT_FOR_DELETION } from "./libs/constants/workspace.constant.js";
import {
	type WorkspaceCreateRequestDto,
	type WorkspaceDeletionImpactResponseDto,
	type WorkspaceDto,
	type WorkspaceGetAllResponseDto,
	type WorkspaceUpdateRequestDto,
} from "./libs/types/types.js";
import { WorkspaceEntity } from "./workspace.entity.js";
import { type WorkspaceRepository } from "./workspace.repository.js";

class WorkspaceService {
	private promptRepository: PromptRepository;

	private workspaceRepository: WorkspaceRepository;

	public constructor(
		workspaceRepository: WorkspaceRepository,
		promptRepository: PromptRepository,
	) {
		this.workspaceRepository = workspaceRepository;
		this.promptRepository = promptRepository;
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
			throw WorkspaceError.notFound();
		}
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
		const workspace = await this.workspaceRepository.findById(id);

		if (!workspace || workspace.toObject().userId !== userId) {
			throw WorkspaceError.notFound();
		}

		const updatedWorkspace = await this.workspaceRepository.update(id, payload);

		return updatedWorkspace.toObject();
	}
}

export { WorkspaceService };
