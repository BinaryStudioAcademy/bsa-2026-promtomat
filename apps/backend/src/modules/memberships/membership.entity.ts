import { type ValueOf, WorkspaceRole } from "@promptomat/shared";

import { type Entity } from "~/libs/types/types.js";

class MembershipEntity implements Entity {
	private id: null | number;

	private role: ValueOf<typeof WorkspaceRole>;

	private userId: number;

	private workspaceId: number;

	private constructor({
		id,
		role,
		userId,
		workspaceId,
	}: {
		id: null | number;
		role: ValueOf<typeof WorkspaceRole>;
		userId: number;
		workspaceId: number;
	}) {
		this.id = id;
		this.role = role;
		this.userId = userId;
		this.workspaceId = workspaceId;
	}

	public static initialize({
		id,
		role,
		userId,
		workspaceId,
	}: {
		id: number;
		role: ValueOf<typeof WorkspaceRole>;
		userId: number;
		workspaceId: number;
	}): MembershipEntity {
		return new MembershipEntity({
			id,
			role,
			userId,
			workspaceId,
		});
	}

	public static initializeNew({
		role,
		userId,
		workspaceId,
	}: {
		role: ValueOf<typeof WorkspaceRole>;
		userId: number;
		workspaceId: number;
	}): MembershipEntity {
		return new MembershipEntity({
			id: null,
			role,
			userId,
			workspaceId,
		});
	}

	public toNewObject(): {
		role: ValueOf<typeof WorkspaceRole>;
		userId: number;
		workspaceId: number;
	} {
		return {
			role: this.role,
			userId: this.userId,
			workspaceId: this.workspaceId,
		};
	}

	public toObject(): {
		id: number;
		role: ValueOf<typeof WorkspaceRole>;
		userId: number;
		workspaceId: number;
	} {
		return {
			id: this.id as number,
			role: this.role,
			userId: this.userId,
			workspaceId: this.workspaceId,
		};
	}
}

export { MembershipEntity };
