import { Entity } from "~/libs/types/entity.type.js";

class LabelEntity implements Entity {
	private id: null | number;

	private name: string;

	private workspaceId: number;

	private constructor({
		id,
		name,
		workspaceId,
	}: {
		id: null | number;
		name: string;
		workspaceId: number;
	}) {
		this.id = id;
		this.name = name;
		this.workspaceId = workspaceId;
	}

	public static initialize({
		id,
		name,
		workspaceId,
	}: {
		createdAt: string;
		id: null | number;
		name: string;
		workspaceId: number;
	}): LabelEntity {
		return new LabelEntity({
			id,
			name,
			workspaceId,
		});
	}

	public static initializeNew({
		name,
		workspaceId,
	}: {
		name: string;
		workspaceId: number;
	}): LabelEntity {
		return new LabelEntity({
			id: null,
			name,
			workspaceId,
		});
	}

	toNewObject() {
		return {
			name: this.name,
			workspaceId: this.workspaceId,
		};
	}

	toObject() {
		return {
			id: this.id as number,
			name: this.name,
			workspaceId: this.workspaceId,
		};
	}
}

export { LabelEntity };
