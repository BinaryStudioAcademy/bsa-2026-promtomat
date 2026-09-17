import { type Entity } from "~/libs/types/types.js";

import {
	type RepositoryBindingCreatePayload,
	type RepositoryBindingDto,
} from "./libs/types/types.js";

class RepositoryBindingEntity implements Entity {
	private host: string;

	private id: null | number;

	private owner: string;

	private repo: string;

	private workspaceId: number;

	private constructor({
		host,
		id,
		owner,
		repo,
		workspaceId,
	}: Omit<RepositoryBindingDto, "id"> & {
		id: null | number;
	}) {
		this.id = id;
		this.host = host;
		this.owner = owner;
		this.repo = repo;
		this.workspaceId = workspaceId;
	}

	public static initialize(
		payload: RepositoryBindingDto,
	): RepositoryBindingEntity {
		return new RepositoryBindingEntity(payload);
	}

	public static initializeNew(
		payload: RepositoryBindingCreatePayload,
	): RepositoryBindingEntity {
		return new RepositoryBindingEntity({
			host: payload.identity.host,
			id: null,
			owner: payload.identity.owner,
			repo: payload.identity.repo,
			workspaceId: payload.workspaceId,
		});
	}

	public toNewObject(): Omit<RepositoryBindingDto, "id"> {
		return {
			host: this.host,
			owner: this.owner,
			repo: this.repo,
			workspaceId: this.workspaceId,
		};
	}

	public toObject(): RepositoryBindingDto {
		return {
			host: this.host,
			id: this.id as number,
			owner: this.owner,
			repo: this.repo,
			workspaceId: this.workspaceId,
		};
	}
}

export { RepositoryBindingEntity };
