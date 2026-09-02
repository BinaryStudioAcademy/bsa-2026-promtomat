import { type Transaction, UniqueViolationError } from "objection";

import { WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { type Transaction, UniqueViolationError } from "objection";

import { WorkspaceError } from "~/libs/exceptions/exceptions.js";

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
		let query = this.workspaceModel.query().where("user_id", userId);

		if (search) {
			query = query.whereILike("name", `%${search}%`);
			query = query.whereILike("name", `%${search}%`);
		}

		const workspaces = await query.execute();
		return workspaces.map((workspace) => WorkspaceEntity.initialize(workspace));
	}

	public async findByNameAndUser(
		name: string,
		userId: number,
	): Promise<null | WorkspaceEntity> {
		const workspace = await this.workspaceModel
			.query()
			.findOne({ name, userId })
			.execute();

		return workspace ? WorkspaceEntity.initialize(workspace) : null;
	}
}

export { WorkspaceRepository };
