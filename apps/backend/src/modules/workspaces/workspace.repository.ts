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
}

export { WorkspaceRepository };
