import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class LabelModel extends AbstractModel {
	public name!: string;

	public workspaceId!: number;

	public static override get tableName(): string {
		return DatabaseTableName.LABELS;
	}
}

export { LabelModel };
