import { WorkspaceVisibility } from "@promptomat/shared";

import { type Entity, type ValueOf } from "~/libs/types/types.js";

class WorkspaceEntity implements Entity {
	private id: null | number;

	private name: string;

	private stackTags: string[];

	private userId: number;

	private visibility: ValueOf<typeof WorkspaceVisibility>;

	private constructor({
		id,
		name,
		stackTags,
		userId,
		visibility,
	}: {
		id: null | number;
		name: string;
		stackTags: string[];
		userId: number;
		visibility: ValueOf<typeof WorkspaceVisibility>;
	}) {
		this.id = id;
		this.name = name;
		this.stackTags = stackTags;
		this.userId = userId;
		this.visibility = visibility;
	}

	public static initialize({
		id,
		name,
		stackTags,
		userId,
		visibility,
	}: {
		id: null | number;
		name: string;
		stackTags: string[];
		userId: number;
		visibility: ValueOf<typeof WorkspaceVisibility>;
	}): WorkspaceEntity {
		return new WorkspaceEntity({
			id,
			name,
			stackTags,
			userId,
			visibility,
		});
	}

	public static initializeNew({
		name,
		stackTags,
		userId,
		visibility,
	}: {
		name: string;
		stackTags: string[];
		userId: number;
		visibility: ValueOf<typeof WorkspaceVisibility>;
	}): WorkspaceEntity {
		return new WorkspaceEntity({
			id: null,
			name,
			stackTags,
			userId,
			visibility,
		});
	}

	public toNewObject(): {
		name: string;
		stackTags: string[];
		userId: number;
		visibility: ValueOf<typeof WorkspaceVisibility>;
	} {
		return {
			name: this.name,
			stackTags: this.stackTags,
			userId: this.userId,
			visibility: this.visibility,
		};
	}

	public toObject(): {
		id: number;
		name: string;
		stackTags: string[];
		userId: number;
		visibility: ValueOf<typeof WorkspaceVisibility>;
	} {
		return {
			id: this.id as number,
			name: this.name,
			stackTags: this.stackTags,
			userId: this.userId,
			visibility: this.visibility,
		};
	}
}

export { WorkspaceEntity };
