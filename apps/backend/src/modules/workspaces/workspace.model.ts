import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";

import { WorkspaceVisibility } from "./libs/enums/enums.js";

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
