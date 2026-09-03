import {
	type PartialModelObject,
	type Transaction,
	UniqueViolationError,
} from "objection";

import { WorkspaceError } from "~/libs/exceptions/exceptions.js";

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
		const { name, stackTags, userId, visibility } = entity.toNewObject();

		try {
			const workspace = await this.workspaceModel
				.query(trx)
				.insert({
					name,
					stackTags,
					userId,
					visibility,
				})
				.returning("*")
				.execute();

			return WorkspaceEntity.initialize(workspace);
		} catch (error) {
			if (error instanceof UniqueViolationError) {
				throw WorkspaceError.nameAlreadyExists();
			}
			throw error;
		}
	}

	public async findAllUserWorkspaces(
		userId: number,
		search?: string,
	): Promise<WorkspaceEntity[]> {
		let query = this.workspaceModel.query().where({ userId });

		if (search) {
			query = query.whereILike("name", `%${search}%`);
		}

		const workspaces = await query.execute();
		return workspaces.map((workspace) => WorkspaceEntity.initialize(workspace));
	}

	public async findById(id: number): Promise<null | WorkspaceEntity> {
		const workspace = await this.workspaceModel.query().findById(id);

		return workspace ? WorkspaceEntity.initialize(workspace) : null;
	}

	public async update(
		id: number,
		payload: WorkspaceUpdateRequestDto,
	): Promise<WorkspaceEntity> {
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
				.patchAndFetchById(id, patch);

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
