import { type Transaction, UniqueViolationError } from "objection";

import { WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { escapeILikePattern } from "~/libs/helpers/helpers.js";

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

	public async findAllByUserId(
		userId: number,
		workspaceName?: string,
	): Promise<WorkspaceEntity[]> {
		const query = this.workspaceModel.query().where({ userId });

		if (workspaceName) {
			const escapedWorkspaceName = escapeILikePattern(workspaceName);
			query.whereILike("name", `%${escapedWorkspaceName}%`);
		}

		const workspaces = await query.execute();
		return workspaces.map((workspace) => WorkspaceEntity.initialize(workspace));
	}

	public async findById(id: number): Promise<null | WorkspaceEntity> {
		const workspace = await this.workspaceModel.query().findById(id);

		return workspace ? WorkspaceEntity.initialize(workspace) : null;
	}
}

export { WorkspaceRepository };
