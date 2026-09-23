import { EntityName } from "~/libs/enums/enums.js";
import { requireEntityId } from "~/libs/helpers/helpers.js";
import { Entity } from "~/libs/types/entity.type.js";

class LabelEntity implements Entity {
	private id: null | number;

	private name: string;

	private stem: null | string;

	private workspaceId: number;

	private constructor({
		id,
		name,
		stem,
		workspaceId,
	}: {
		id: null | number;
		name: string;
		stem: null | string;
		workspaceId: number;
	}) {
		this.id = id;
		this.name = name;
		this.stem = stem;
		this.workspaceId = workspaceId;
	}

	public static initialize({
		id,
		name,
		workspaceId,
	}: {
		id: number;
		name: string;
		workspaceId: number;
	}): LabelEntity {
		return new LabelEntity({
			id,
			name,
			stem: null,
			workspaceId,
		});
	}

	public static initializeNew({
		name,
		stem,
		workspaceId,
	}: {
		name: string;
		stem: string;
		workspaceId: number;
	}): LabelEntity {
		return new LabelEntity({
			id: null,
			name,
			stem,
			workspaceId,
		});
	}

	public toNewObject(): {
		name: string;
		stem: null | string;
		workspaceId: number;
	} {
		return {
			name: this.name,
			stem: this.stem,
			workspaceId: this.workspaceId,
		};
	}

	public toObject(): {
		id: number;
		name: string;
		workspaceId: number;
	} {
		return {
			id: requireEntityId(this.id, EntityName.LABEL),
			name: this.name,
			workspaceId: this.workspaceId,
		};
	}
}

export { LabelEntity };
