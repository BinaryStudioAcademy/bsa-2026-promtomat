import {
	type PartialModelObject,
	type Transaction,
	UniqueViolationError,
} from "objection";

import { WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { escapeILikePattern } from "~/libs/helpers/helpers.js";

import { type WorkspaceUpdateRequestDto } from "./libs/types/types.js";
import { WorkspaceEntity } from "./workspace.entity.js";
import { type WorkspaceModel } from "./workspace.model.js";

class WorkspaceRepository {
	private workspaceModel: typeof WorkspaceModel;

	public constructor(workspaceModel: typeof WorkspaceModel) {
		this.workspaceModel = workspaceModel;
	}

	public async create(
		entity: WorkspaceEntity,
		trx?: Transaction,
	): Promise<WorkspaceEntity> {
		try {
			const workspace = await this.workspaceModel
				.query(trx)
				.insert(entity.toNewObject())
				.execute();

			return WorkspaceEntity.initialize(workspace);
		} catch (error) {
			if (error instanceof UniqueViolationError) {
				throw WorkspaceError.nameAlreadyExists();
			}
			throw error;
		}
	}

	public async deleteById(id: number, trx: Transaction): Promise<void> {
		await this.workspaceModel.query(trx).deleteById(id).execute();
	}

	public async findAllByUserId(
		userId: number,
		workspaceName?: string,
	): Promise<WorkspaceEntity[]> {
		const query = this.workspaceModel.query().where({ userId }).orderBy("id");

		if (workspaceName) {
			const escapedWorkspaceName = escapeILikePattern(workspaceName);
			query.whereILike("name", `%${escapedWorkspaceName}%`);
		}

		const workspaces = await query.execute();
		return workspaces.map((workspace) => WorkspaceEntity.initialize(workspace));
	}

	public async findAllByUserIdForUpdate(
		userId: number,
		trx: Transaction,
	): Promise<WorkspaceEntity[]> {
		const workspaces = await this.workspaceModel
			.query(trx)
			.where({ userId })
			.orderBy("id")
			.forUpdate()
			.execute();

		return workspaces.map((workspace) => WorkspaceEntity.initialize(workspace));
	}

	public async findById(
		id: number,
		trx?: Transaction,
	): Promise<null | WorkspaceEntity> {
		const workspace = await this.workspaceModel.query(trx).findById(id);

		return workspace ? WorkspaceEntity.initialize(workspace) : null;
	}

	public async update(
		id: number,
		payload: WorkspaceUpdateRequestDto,
	): Promise<null | WorkspaceEntity> {
		const patch: PartialModelObject<WorkspaceModel> = {};

		if (payload.name !== undefined) {
			patch.name = payload.name;
		}

		if (payload.stackTags !== undefined) {
			patch.stackTags = payload.stackTags;
		}

		try {
			const workspace = await this.workspaceModel
				.query()
				.patchAndFetchById(id, patch)
				.castTo<undefined | WorkspaceModel>();

			if (!workspace) {
				return null;
			}

			return WorkspaceEntity.initialize(workspace);
		} catch (error) {
			if (error instanceof UniqueViolationError) {
				throw WorkspaceError.nameAlreadyExists();
			}

			throw error;
		}
	}
}

export { WorkspaceRepository };
