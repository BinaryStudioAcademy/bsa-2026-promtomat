import { type Entity } from "~/libs/types/types.js";

import {
	type ContributorCreatePayload,
	type ContributorDto,
} from "./libs/types/types.js";

class ContributorEntity implements Entity {
	private id: null | number;

	private userId: number;

	private workspaceId: number;

	private constructor({
		id,
		userId,
		workspaceId,
	}: ContributorCreatePayload & {
		id: null | number;
	}) {
		this.id = id;
		this.userId = userId;
		this.workspaceId = workspaceId;
	}

	public static initialize(payload: ContributorDto): ContributorEntity {
		return new ContributorEntity(payload);
	}

	public static initializeNew(
		payload: ContributorCreatePayload,
	): ContributorEntity {
		return new ContributorEntity({
			id: null,
			...payload,
		});
	}

	public toNewObject(): ContributorCreatePayload {
		return {
			userId: this.userId,
			workspaceId: this.workspaceId,
		};
	}

	public toObject(): ContributorDto {
		return {
			id: this.id as number,
			userId: this.userId,
			workspaceId: this.workspaceId,
		};
	}
}

export { ContributorEntity };
