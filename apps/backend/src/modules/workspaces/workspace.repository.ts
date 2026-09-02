import { type Transaction } from "objection";

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
	}

	public async findAll(): Promise<WorkspaceEntity[]> {
		const workspaces = await this.workspaceModel.query().execute();

		return workspaces.map((workspace) => WorkspaceEntity.initialize(workspace));
	}

	public async findAllUserWorkspaces(
		userId: number,
		search?: string,
	): Promise<WorkspaceEntity[]> {
		const query = this.workspaceModel.query().where("user_id", userId);

		if (search) {
			query.whereILike("name", `%${search}`);
		}

		const workspaces = await query.execute();
		return workspaces.map((workspace) => WorkspaceEntity.initialize(workspace));
	}

	public async findById(id: number): Promise<null | WorkspaceEntity> {
		const workspace = await this.workspaceModel.query().findById(id);

		return workspace ? WorkspaceEntity.initialize(workspace) : null;
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
