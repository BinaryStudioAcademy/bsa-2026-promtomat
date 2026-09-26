import { EntityName, WorkspaceTargets } from "~/libs/enums/enums.js";
import { requireEntityId } from "~/libs/helpers/helpers.js";
import { type Entity, type ValueOf } from "~/libs/types/types.js";

import { WorkspaceVisibility } from "./libs/enums/enums.js";
import {
	type WorkspaceDto,
	type WorkspaceEntityInitializeNewPayload,
	type WorkspaceEntityPayload,
} from "./libs/types/types.js";

class WorkspaceEntity implements Entity {
	private datasetTarget: ValueOf<typeof WorkspaceTargets>;

	private description: string;

	private id: null | number;

	private name: string;

	private stackTags: string[];

	private userId: number;

	private visibility: ValueOf<typeof WorkspaceVisibility>;

	private constructor({
		datasetTarget,
		description,
		id,
		name,
		stackTags,
		userId,
		visibility,
	}: WorkspaceEntityPayload) {
		this.datasetTarget = datasetTarget;
		this.description = description;
		this.id = id;
		this.name = name;
		this.stackTags = stackTags;
		this.userId = userId;
		this.visibility = visibility;
	}

	public static initialize({
		datasetTarget,
		description,
		id,
		name,
		stackTags,
		userId,
		visibility,
	}: WorkspaceDto): WorkspaceEntity {
		return new WorkspaceEntity({
			datasetTarget,
			description,
			id,
			name,
			stackTags,
			userId,
			visibility,
		});
	}

	public static initializeNew({
		datasetTarget,
		description = "",
		name,
		stackTags = [],
		userId,
		visibility = WorkspaceVisibility.PRIVATE,
	}: WorkspaceEntityInitializeNewPayload): WorkspaceEntity {
		return new WorkspaceEntity({
			datasetTarget,
			description,
			id: null,
			name,
			stackTags,
			userId,
			visibility,
		});
	}

	public toNewObject(): Omit<WorkspaceDto, "id"> {
		return {
			datasetTarget: this.datasetTarget,
			description: this.description,
			name: this.name,
			stackTags: this.stackTags,
			userId: this.userId,
			visibility: this.visibility,
		};
	}

	public toObject(): WorkspaceDto {
		return {
			datasetTarget: this.datasetTarget,
			description: this.description,
			id: requireEntityId(this.id, EntityName.WORKSPACE),
			name: this.name,
			stackTags: this.stackTags,
			userId: this.userId,
			visibility: this.visibility,
		};
	}
}

export { WorkspaceEntity };
