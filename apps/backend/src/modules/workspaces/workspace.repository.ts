import { type Transaction, UniqueViolationError } from "objection";

import { WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { escapeILikePattern } from "~/libs/helpers/helpers.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { PromptColumnName } from "../prompts/libs/enums/enums.js";
import { WorkspaceColumnName } from "./libs/enums/enums.js";
import {
	type WorkspaceListItemDto,
	type WorkspaceUpdateRequestDto,
} from "./libs/types/types.js";
import { WorkspaceEntity } from "./workspace.entity.js";
import { type WorkspaceModel } from "./workspace.model.js";

type WorkspaceListRow = WorkspaceModel & {
	promptCount: string;
};

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
	): Promise<WorkspaceListItemDto[]> {
		const query = this.workspaceModel
			.query()
			.select(`${DatabaseTableName.WORKSPACES}.*`)
			.count(
				`${DatabaseTableName.PROMPTS}.${PromptColumnName.ID} as promptCount`,
			)
			.leftJoinRelated("prompts")
			.where(
				`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.USER_ID}`,
				userId,
			)
			.groupBy(`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`)
			.orderBy(`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.ID}`);

		if (workspaceName) {
			const escapedWorkspaceName = escapeILikePattern(workspaceName);
			query.whereILike(
				`${DatabaseTableName.WORKSPACES}.${WorkspaceColumnName.NAME}`,
				`%${escapedWorkspaceName}%`,
			);
		}

		const workspaces = await query.castTo<WorkspaceListRow[]>().execute();

		return workspaces.map((workspace) => {
			const workspaceDto = WorkspaceEntity.initialize(workspace).toObject();
			const promptCount = Number(workspace.promptCount);

			return {
				...workspaceDto,
				promptCount,
			};
		});
	}

	public async findByIdAndUserId(
		id: number,
		userId: number,
	): Promise<null | WorkspaceEntity> {
		const workspace = await this.workspaceModel.query().findOne({ id, userId });

		return workspace ? WorkspaceEntity.initialize(workspace) : null;
	}

	public async findCountByUserIdWithLock(
		userId: number,
		trx: Transaction,
	): Promise<number> {
		const workspaces = await this.workspaceModel
			.query(trx)
			.select(WorkspaceColumnName.ID)
			.where({ userId })
			.orderBy(WorkspaceColumnName.ID)
			.forUpdate()
			.execute();

		return workspaces.length;
	}

	public async update(
		id: number,
		payload: WorkspaceUpdateRequestDto,
	): Promise<null | WorkspaceEntity> {
		try {
			const workspace = await this.workspaceModel
				.query()
				.patchAndFetchById(id, payload)
				// Objection types this result as WorkspaceModel, but it can return undefined when no workspace matches the id
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
