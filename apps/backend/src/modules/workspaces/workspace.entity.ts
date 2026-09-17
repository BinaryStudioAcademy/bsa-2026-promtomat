import { type Entity, type ValueOf } from "~/libs/types/types.js";

import { WorkspaceVisibility } from "./libs/enums/enums.js";
import {
	type WorkspaceDto,
	type WorkspaceEntityInitializeNewPayload,
	type WorkspaceEntityPayload,
} from "./libs/types/types.js";

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
	}: WorkspaceEntityPayload) {
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
	}: WorkspaceEntityPayload): WorkspaceEntity {
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
		stackTags = [],
		userId,
		visibility = WorkspaceVisibility.PRIVATE,
	}: WorkspaceEntityInitializeNewPayload): WorkspaceEntity {
		return new WorkspaceEntity({
			id: null,
			name,
			stackTags,
			userId,
			visibility,
		});
	}

	public toNewObject(): Omit<WorkspaceDto, "id"> {
		return {
			name: this.name,
			stackTags: this.stackTags,
			userId: this.userId,
			visibility: this.visibility,
		};
	}

	public toObject(): WorkspaceDto {
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
