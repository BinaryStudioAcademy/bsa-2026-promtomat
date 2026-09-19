import { type ApiTokenDto, type Entity } from "~/libs/types/types.js";

class ApiTokenEntity implements Entity {
	private lastUsedAt: null | string;

	private name: string;

	private publicId: null | string;

	private tokenHash: string;

	private userId: number;

	private constructor({
		lastUsedAt,
		name,
		publicId,
		tokenHash,
		userId,
	}: {
		lastUsedAt: null | string;
		name: string;
		publicId: null | string;
		tokenHash: string;
		userId: number;
	}) {
		this.publicId = publicId;
		this.userId = userId;
		this.name = name;
		this.lastUsedAt = lastUsedAt;
		this.tokenHash = tokenHash;
	}

	public static initialize({
		lastUsedAt,
		name,
		publicId,
		tokenHash,
		userId,
	}: {
		lastUsedAt: null | string;
		name: string;
		publicId: string;
		tokenHash: string;
		userId: number;
	}): ApiTokenEntity {
		return new ApiTokenEntity({
			lastUsedAt,
			name,
			publicId,
			tokenHash,
			userId,
		});
	}

	public static initializeNew({
		name,
		publicId,
		tokenHash,
		userId,
	}: {
		name: string;
		publicId: string;
		tokenHash: string;
		userId: number;
	}): ApiTokenEntity {
		return new ApiTokenEntity({
			lastUsedAt: null,
			name,
			publicId,
			tokenHash,
			userId,
		});
	}

	public toAuthObject(): {
		lastUsedAt: null | string;
		publicId: string;
		tokenHash: string;
		userId: number;
	} {
		return {
			lastUsedAt: this.lastUsedAt,
			publicId: this.publicId as string,
			tokenHash: this.tokenHash,
			userId: this.userId,
		};
	}

	public toNewObject(): {
		lastUsedAt: null | string;
		name: string;
		publicId: string;
		tokenHash: string;
		userId: number;
	} {
		return {
			lastUsedAt: this.lastUsedAt,
			name: this.name,
			publicId: this.publicId as string,
			tokenHash: this.tokenHash,
			userId: this.userId,
		};
	}

	public toObject(): ApiTokenDto {
		return {
			id: this.publicId as string,
			lastUsedAt: this.lastUsedAt,
			name: this.name,
		};
	}
}

export { ApiTokenEntity };
