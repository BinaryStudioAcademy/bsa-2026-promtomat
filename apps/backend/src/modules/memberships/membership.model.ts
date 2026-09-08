import { type ValueOf, type WorkspaceRole } from "@promptomat/shared";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class MembershipModel extends AbstractModel {
	public role!: ValueOf<typeof WorkspaceRole>;

	public userId!: number;

	public workspaceId!: number;

	public static override get tableName(): string {
		return DatabaseTableName.MEMBERSHIPS;
	}
}

export { MembershipModel };
