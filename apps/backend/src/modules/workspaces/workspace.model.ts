import { type ValueOf, WorkspaceVisibility } from "@promptomat/shared";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class WorkspaceModel extends AbstractModel {
	public name!: string;

	public stackTags!: string[];

	public userId!: number;

	public visibility!: ValueOf<typeof WorkspaceVisibility>;

	public static override get tableName(): string {
		return DatabaseTableName.WORKSPACES;
	}
}

export { WorkspaceModel };
