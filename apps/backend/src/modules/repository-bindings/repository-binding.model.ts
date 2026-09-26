import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class RepositoryBindingModel extends AbstractModel {
	public host!: string;

	public owner!: string;

	public repo!: string;

	public workspaceId!: number;

	public static override get tableName(): string {
		return DatabaseTableName.REPOSITORY_BINDINGS;
	}
}

export { RepositoryBindingModel };
